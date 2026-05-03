import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, copyAsync, deleteAsync } from 'expo-file-system/legacy';
import { AnalyzeResult } from '@dogdex/shared';
import { useAuth } from './useAuth';
import { syncService } from '../services/syncService';
import { useCallback, useMemo, useRef } from 'react';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export interface DogdexEntry {
  id: string;
  timestamp: string;
  breedName: string;
  confidence: number;
  locationAddr: string;
  imageUri: string;
  dogData: AnalyzeResult['dogData'];
  status?: 'local' | 'synced' | 'deleted';
  localId?: string;
}

export function useDogdexStorage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const envSuffix = useMemo(() => {
    const appId = Constants.expoConfig?.android?.package || '';
    return appId.endsWith('.dev') ? '_dev' : '_prod';
  }, []);

  const STORAGE_KEY = `@dogdex_history${envSuffix}`;
  const TOUR_COMPLETED_KEY = `@dogdex_tour_completed${envSuffix}`;

  // 1. uploadImage (Base)
  const uploadImage = useCallback(async (uri: string, filename: string): Promise<string | null> => {
    try {
      const extra = Constants.expoConfig?.extra;
      const bucket = extra?.supabaseBucket || 'dog-photos';
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
      if (error) throw error;
      return data.path;
    } catch (err) {
      console.error('❌ [STORAGE] Upload failed:', err);
      return null;
    }
  }, []);

  // 2. getEntries (Base)
  const getEntries = useCallback(async (): Promise<DogdexEntry[]> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const entries: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      return entries.filter(e => e.status !== 'deleted');
    } catch (error) {
      console.error('Error fetching Dogdex entries:', error);
      return [];
    }
  }, [STORAGE_KEY]);

  // 3. syncWithCloud (Depende de uploadImage e getEntries)
  const syncLock = useRef(false);
  const syncWithCloud = useCallback(async (): Promise<{ pulled: number, pushed: number }> => {
    if (!token) return { pulled: 0, pushed: 0 };
    if (syncLock.current) {
      console.log('[SYNC] Já existe um sincronismo em andamento. Ignorando.');
      return { pulled: 0, pushed: 0 };
    }
    syncLock.current = true;
    try {
      const localStr = await AsyncStorage.getItem(STORAGE_KEY);
      let local: DogdexEntry[] = localStr ? JSON.parse(localStr) : [];
      const pending = local.filter(e => e.status !== 'synced' && e.status !== 'deleted');
      const toDelete = local.filter(e => e.status === 'deleted');
      if (toDelete.length > 0) {
        await syncService.push(token, toDelete);
      }
      if (pending.length > 0) {
        const entriesWithUploadedImages = (await Promise.all(pending.map(async (e) => {
          if (e.imageUri.startsWith('file://')) {
            const filename = e.imageUri.split('/').pop() || `dogdex_${Date.now()}.jpg`;
            const uploadedPath = await uploadImage(e.imageUri, filename);
            if (uploadedPath) return { ...e, imageUri: uploadedPath };
            return null;
          }
          return e;
        }))).filter(e => e !== null) as DogdexEntry[];
        if (entriesWithUploadedImages.length > 0) {
          await syncService.push(token, entriesWithUploadedImages);
          entriesWithUploadedImages.forEach(e => {
            const idx = local.findIndex(l => l.id === e.id);
            if (idx !== -1) local[idx].status = 'synced';
          });
        }
      }
      const cloudEntries = await syncService.pull(token);
      const extra = Constants.expoConfig?.extra;
      const supabaseUrl = extra?.supabaseUrl;
      const bucket = extra?.supabaseBucket || 'dog-photos';
      const mergedMap = new Map<string, DogdexEntry>();
      local.forEach(e => mergedMap.set(e.id, { ...e, status: e.status || 'local' }));
      for (const ce of cloudEntries) {
        const existing = mergedMap.get(ce.id);
        if (existing?.status === 'deleted') continue;
        let finalUri = ce.imageUri;
        if (finalUri && !finalUri.startsWith('http') && !finalUri.startsWith('file://') && supabaseUrl) {
          finalUri = `${supabaseUrl}/storage/v1/object/public/${bucket}/${finalUri}`;
        }
        const resolvedUri = existing?.imageUri?.startsWith('file://') ? existing.imageUri : finalUri;
        mergedMap.set(ce.id, { ...ce, imageUri: resolvedUri, status: 'synced' });
      }
      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const finalSyncResults = merged.filter(e => e.status !== 'deleted');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalSyncResults));
      return { pulled: cloudEntries.length, pushed: pending.length };
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    } finally {
      syncLock.current = false;
    }
  }, [token, uploadImage, STORAGE_KEY]);

  // 4. saveEntry (Depende de syncWithCloud e uploadImage)
  const saveEntry = useCallback(async (
    photoUri: string,
    result: AnalyzeResult,
    locationAddr: string
  ): Promise<DogdexEntry | null> => {
    try {
      if (!photoUri) throw new Error('No photo URI provided');
      const filename = photoUri.split('/').pop() || `dogdex_${Date.now()}.jpg`;
      let finalImageUri = photoUri;
      const docDir = documentDirectory;
      if (docDir) {
        const permanentPath = `${docDir}${Date.now()}_${filename}`;
        await copyAsync({ from: photoUri, to: permanentPath });
        finalImageUri = permanentPath;
      }
      const newEntry: DogdexEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        breedName: result.breed || 'Raça não identificada',
        confidence: result.confidence || 0,
        locationAddr,
        imageUri: finalImageUri,
        dogData: result.dogData,
        status: 'local'
      };
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...existing]));
      if (token) {
        try {
          const uploadedPath = await uploadImage(finalImageUri, filename);
          const entryToPush = { ...newEntry, imageUri: uploadedPath || newEntry.imageUri };
          await syncService.push(token, [entryToPush]);
          newEntry.status = 'synced';
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...existing]));
        } catch (syncErr) {
          console.warn('Background sync failed, entry remains local:', syncErr);
        }
      }
      return newEntry;
    } catch (error) {
      console.error('Error saving Dogdex entry:', error);
      return null;
    }
  }, [token, uploadImage, STORAGE_KEY]);

  // 5. deleteEntry (Depende de syncWithCloud)
  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      const entryToDelete = existing.find(e => e.id === id);
      if (!entryToDelete) return false;
      if (documentDirectory && entryToDelete.imageUri.startsWith(documentDirectory)) {
        await deleteAsync(entryToDelete.imageUri, { idempotent: true }).catch(() => {});
      }
      let updated = entryToDelete.status === 'synced'
        ? existing.map(e => e.id === id ? { ...e, status: 'deleted' } : e)
        : existing.filter(e => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (token) {
        syncWithCloud().catch(err => console.warn('Sync after delete failed:', err));
      }
      return true;
    } catch (error) {
      console.error('Error deleting Dogdex entry:', error);
      return false;
    }
  }, [STORAGE_KEY, token, syncWithCloud]);

  const hasCompletedTour = useCallback(async (): Promise<boolean> => {
    try {
      const val = await AsyncStorage.getItem(TOUR_COMPLETED_KEY);
      return val === 'true';
    } catch { return false; }
  }, [TOUR_COMPLETED_KEY]);

  const completeTour = useCallback(async (): Promise<void> => {
    try { await AsyncStorage.setItem(TOUR_COMPLETED_KEY, 'true'); }
    catch (e) { console.error('Error completing tour:', e); }
  }, [TOUR_COMPLETED_KEY]);

  const resetTour = useCallback(async (): Promise<void> => {
    try { await AsyncStorage.removeItem(TOUR_COMPLETED_KEY); }
    catch (e) { console.error('Error resetting tour:', e); }
  }, [TOUR_COMPLETED_KEY]);

  return useMemo(() => ({ 
    saveEntry, getEntries, deleteEntry, hasCompletedTour, completeTour, resetTour, syncWithCloud 
  }), [saveEntry, getEntries, deleteEntry, hasCompletedTour, completeTour, resetTour, syncWithCloud]);
}
