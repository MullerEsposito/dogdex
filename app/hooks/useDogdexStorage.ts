import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, copyAsync, deleteAsync, writeAsStringAsync, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { AnalyzeResult } from '@dogdex/shared';
import { useAuth } from './useAuth';
import { syncService } from '../services/syncService';

export interface DogdexEntry {
  id: string;
  timestamp: string;
  breedName: string;
  confidence: number;
  locationAddr: string;
  imageUri: string;
  dogData: AnalyzeResult['dogData'];
  status?: 'local' | 'synced';
}

const STORAGE_KEY = '@dogdex_history';
const TOUR_COMPLETED_KEY = '@dogdex_tour_completed';

export function useDogdexStorage() {
  const { session } = useAuth();
  const token = session?.access_token;
  const saveEntry = async (
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
        try {
          await copyAsync({
            from: photoUri,
            to: permanentPath
          });
          finalImageUri = permanentPath;
        } catch (copyErr) {
          console.warn('Could not copy file to permanent storage, using original URI:', copyErr);
        }
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
      let updated = [newEntry, ...existing];
      
      // Save locally first
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Try background sync if logged in
      if (token) {
        try {
          await syncService.push(token, [newEntry]);
          // If successful, mark as synced
          newEntry.status = 'synced';
          const finalUpdate = [newEntry, ...existing];
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalUpdate));
        } catch (syncErr) {
          console.warn('Background sync failed, entry remains local:', syncErr);
        }
      }

      return newEntry;
    } catch (error) {
      console.error('Error saving Dogdex entry:', error);
      return null;
    }
  };

  const getEntries = async (): Promise<DogdexEntry[]> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch (error) {
      console.error('Error fetching Dogdex entries:', error);
      return [];
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      
      const entryToDelete = existing.find(e => e.id === id);
      if (!entryToDelete) return false;

      // Clean up physical file if on native
      if (documentDirectory && entryToDelete.imageUri.startsWith(documentDirectory)) {
        try {
          await deleteAsync(entryToDelete.imageUri, { idempotent: true });
        } catch (fileErr) {
          console.warn('Could not delete image file:', fileErr);
        }
      }

      const updated = existing.filter(e => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error deleting Dogdex entry:', error);
      return false;
    }
  };

  const hasCompletedTour = async (): Promise<boolean> => {
    try {
      const val = await AsyncStorage.getItem(TOUR_COMPLETED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  };

  const completeTour = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    } catch (e) {
      console.error('Error completing tour:', e);
    }
  };

  const resetTour = async (): Promise<void> => {
     try {
         await AsyncStorage.removeItem(TOUR_COMPLETED_KEY);
     } catch (e) {
         console.error('Error resetting tour:', e);
     }
  };

  const exportBackup = async (): Promise<void> => {
    try {
      const entries = await getEntries();
      if (entries.length === 0) {
        Alert.alert('Backup Vazio', 'Não há registros para exportar.');
        return;
      }

      // Embed each image as Base64 so the backup file is self-contained
      const entriesWithImages = await Promise.all(
        entries.map(async (entry) => {
          try {
            const base64 = await readAsStringAsync(entry.imageUri, { encoding: EncodingType.Base64 });
            return { ...entry, imageBase64: base64 };
          } catch {
            return { ...entry, imageBase64: null };
          }
        })
      );

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        count: entries.length,
        entries: entriesWithImages,
      };

      const backupPath = `${documentDirectory}dogdex_backup_${Date.now()}.dogdex.json`;
      await writeAsStringAsync(backupPath, JSON.stringify(backup), { encoding: EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(backupPath, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar DogDex Backup',
          UTI: 'public.json',
        });
      } else {
        Alert.alert('Backup salvo', `Arquivo salvo em:\n${backupPath}`);
      }
    } catch (error) {
      console.error('Error exporting backup:', error);
      Alert.alert('Erro', 'Não foi possível exportar o backup.');
    }
  };

  const importBackup = async (): Promise<number> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return 0;

      const fileUri = result.assets[0].uri;
      const raw = await readAsStringAsync(fileUri, { encoding: EncodingType.UTF8 });
      const backup = JSON.parse(raw);

      if (!backup.entries || !Array.isArray(backup.entries)) {
        Alert.alert('Arquivo inválido', 'Este arquivo não é um backup válido do DogDex.');
        return 0;
      }

      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      const existingIds = new Set(existing.map((e) => e.id));

      const restored: DogdexEntry[] = [];
      const docDir = documentDirectory ?? '';

      for (const entry of backup.entries) {
        if (existingIds.has(entry.id)) continue; // skip duplicates

        let finalImageUri = entry.imageUri;

        // Restore image from Base64 if available
        if (entry.imageBase64 && docDir) {
          const restoredPath = `${docDir}restored_${entry.id}.jpg`;
          try {
            await writeAsStringAsync(restoredPath, entry.imageBase64, { encoding: EncodingType.Base64 });
            finalImageUri = restoredPath;
          } catch (imgErr) {
            console.warn('Could not restore image for entry:', entry.id, imgErr);
          }
        }

        const { imageBase64: _, ...cleanEntry } = entry;
        restored.push({ ...cleanEntry, imageUri: finalImageUri });
      }

      if (restored.length === 0) {
        Alert.alert('Nada a importar', 'Todos os registros do backup já existem na sua DogDex.');
        return 0;
      }

      const updated = [...restored, ...existing];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return restored.length;
    } catch (error) {
      console.error('Error importing backup:', error);
      Alert.alert('Erro', 'Não foi possível importar o backup. Verifique se o arquivo é válido.');
      return 0;
    }
  };

  const syncWithCloud = async (): Promise<{ pulled: number, pushed: number }> => {
    if (!token) return { pulled: 0, pushed: 0 };
    
    try {
      // 1. Pull from cloud
      const cloudEntries = await syncService.pull(token);
      
      // 2. Get local entries
      const localStr = await AsyncStorage.getItem(STORAGE_KEY);
      const local: DogdexEntry[] = localStr ? JSON.parse(localStr) : [];
      
      // 3. Find pending locals to push
      const pending = local.filter(e => e.status !== 'synced');
      if (pending.length > 0) {
        await syncService.push(token, pending);
      }

      // 4. Merge entries (prefer cloud data as source of truth for synced fields)
      const mergedMap = new Map<string, DogdexEntry>();
      
      // Add local first
      local.forEach(e => mergedMap.set(e.id, { ...e, status: e.status || 'local' }));
      
      // Add cloud entries (overwriting local if same ID, marking as synced)
      cloudEntries.forEach(ce => {
        const existing = mergedMap.get(ce.id);
        mergedMap.set(ce.id, {
          ...ce,
          // Keep local image URI if it exists locally, otherwise it's a "cloud-only" entry until we download images (future phase)
          imageUri: existing?.imageUri || ce.imageUri, 
          status: 'synced'
        });
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      
      return { 
        pulled: cloudEntries.length, 
        pushed: pending.length 
      };
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  };

  return { 
    saveEntry, 
    getEntries, 
    deleteEntry, 
    hasCompletedTour, 
    completeTour, 
    resetTour, 
    exportBackup, 
    importBackup,
    syncWithCloud 
  };
}
