import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, copyAsync, deleteAsync } from 'expo-file-system/legacy';
import { AnalyzeResult } from '@dogdex/shared';
import { useAuth } from './useAuth';
import { syncService } from '../services/syncService';
import { useCallback, useMemo } from 'react';
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

const STORAGE_KEY = '@dogdex_history';
const TOUR_COMPLETED_KEY = '@dogdex_tour_completed';

export function useDogdexStorage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const uploadImage = useCallback(async (uri: string, filename: string): Promise<string | null> => {
    try {
      const extra = Constants.expoConfig?.extra;
      const bucket = extra?.supabaseBucket || 'dog-photos';

      // Lê o arquivo como base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Converte para ArrayBuffer (Supabase prefere)
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
          // Upload foto para o Supabase Storage antes de sincronizar metadados
          const uploadedPath = await uploadImage(finalImageUri, filename);
          
          const entryToPush = {
            ...newEntry,
            imageUri: uploadedPath || newEntry.imageUri // Se upload falhou, manda URI local (fallback ruim mas tenta)
          };

          await syncService.push(token, [entryToPush]);
          
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
  }, [token]);

  const getEntries = useCallback(async (): Promise<DogdexEntry[]> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const entries: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      // Oculta itens marcados como apagados da interface
      return entries.filter(e => e.status !== 'deleted');
    } catch (error) {
      console.error('Error fetching Dogdex entries:', error);
      return [];
    }
  }, []);

  const deleteEntry = useCallback(async (id: string): Promise<boolean> => {
    try {
      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      
      const entryToDelete = existing.find(e => e.id === id);
      if (!entryToDelete) return false;

      // Limpeza final do arquivo físico se estiver no nativo
      if (documentDirectory && entryToDelete.imageUri.startsWith(documentDirectory)) {
        try {
          await deleteAsync(entryToDelete.imageUri, { idempotent: true });
        } catch (fileErr) {
          console.warn('Could not delete image file:', fileErr);
        }
      }

      let updated = [];
      if (entryToDelete.status === 'synced') {
        // Marca como apagado para sincronizar, mas remove da visualização
        updated = existing.map(e => e.id === id ? { ...e, status: 'deleted' } : e);
        console.log('🗑️ [STORAGE] Item marcado para exclusão via sincronização');
      } else {
        // Remove itens locais imediatamente
        updated = existing.filter(e => e.id !== id);
        console.log('🗑️ [STORAGE] Item local removido diretamente');
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Dispara sincronização em background se houver token
      if (token) {
        syncWithCloud().catch(err => console.warn('Background sync after delete failed:', err));
      }

      return true;
    } catch (error) {
      console.error('Error deleting Dogdex entry:', error);
      return false;
    }
  }, []);

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


   const syncWithCloud = useCallback(async (): Promise<{ pulled: number, pushed: number }> => {
    console.log('🔄 [STORAGE] Starting cloud sync...');
    
    // DEBUG: Listar arquivos locais para ver se as fotos existem
    try {
      const docs = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
      console.log('📂 [DEBUG] Arquivos na pasta de documentos:', docs.length);
      console.log('📂 [DEBUG] Lista:', docs.join(', '));
    } catch (e) {
      console.log('📂 [DEBUG] Erro ao ler pasta de documentos:', e);
    }

    if (!token) {
      console.log('🔄 [STORAGE] Sync aborted: No auth token found');
      return { pulled: 0, pushed: 0 };
    }
    
    try {
      // 1. Pega entradas locais
      const localStr = await AsyncStorage.getItem(STORAGE_KEY);
      let local: DogdexEntry[] = localStr ? JSON.parse(localStr) : [];
      
      console.log(`🔄 [STORAGE] Local entries count: ${local.length}`);
      
      // 2. Envia mudanças locais primeiro (importante para exclusões)
      // FILTRO CRÍTICO: Só enviamos o que não foi sincronizado E que não está deletado
      const pending = local.filter(e => e.status !== 'synced' && e.status !== 'deleted');
      console.log(`🔄 [STORAGE] Pending push count (excluding deleted): ${pending.length}`);
      
      // Separamos os itens marcados para deleção para enviar o comando de delete para o backend
      const toDelete = local.filter(e => e.status === 'deleted');
      if (toDelete.length > 0) {
        console.log(`🗑️ [STORAGE] Notificando backend sobre ${toDelete.length} exclusões...`);
        await syncService.push(token, toDelete);
      }
      
      if (pending.length > 0) {
        console.log('🚀 [STORAGE] Enviando novos itens para a nuvem:', pending.map(p => p.breedName).join(', '));
        // Para cada item pendente, tentamos fazer upload da imagem se for local
        const entriesWithUploadedImages = await Promise.all(pending.map(async (e) => {
          if (e.imageUri.startsWith('file://')) {
            const filename = e.imageUri.split('/').pop() || `dogdex_${Date.now()}.jpg`;
            const uploadedPath = await uploadImage(e.imageUri, filename);
            if (uploadedPath) {
              return { ...e, imageUri: uploadedPath };
            }
          }
          return e;
        }));

        await syncService.push(token, entriesWithUploadedImages);
        
        // Atualiza o status local para synced para esses itens
        entriesWithUploadedImages.forEach(e => {
          const idx = local.findIndex(l => l.id === e.id);
          if (idx !== -1) local[idx].status = 'synced';
        });
      }

      // 3. Agora baixa o estado atualizado da nuvem
      console.log('🔄 [STORAGE] Pulling from cloud...');
      const cloudEntries = await syncService.pull(token);
      console.log(`🔄 [STORAGE] Pulled ${cloudEntries.length} entries from cloud`);
      
      const extra = Constants.expoConfig?.extra;
      const supabaseUrl = extra?.supabaseUrl;
      const bucket = extra?.supabaseBucket || 'dog-photos';

      // 4. Mescla as entradas
      const mergedMap = new Map<string, DogdexEntry>();
      
      // Add local first
      local.forEach(e => mergedMap.set(e.id, { ...e, status: e.status || 'local' }));
      
      // Add cloud entries
      for (const ce of cloudEntries) {
        const existing = mergedMap.get(ce.id);
        
        // PRIORIDADE ABSOLUTA: Se o item já existe localmente e está marcado como 'deleted',
        // nós JAMAIS o sobrescrevemos com dados da nuvem.
        if (existing?.status === 'deleted') {
          console.log(`🚫 [STORAGE] Mantendo exclusão local para ${ce.id}`);
          continue;
        }

        // Resolve Image URL
        let finalUri = ce.imageUri;
        let needsUpload = false;
        
        // Se a URI salva na nuvem for um caminho absoluto local, tentamos recuperar.
        if (ce.imageUri && ce.imageUri.startsWith('file:///')) {
          const fileName = ce.imageUri.split('/').pop();
          finalUri = fileName || ce.imageUri;

          // Se o arquivo existir NESTE dispositivo, marcamos que precisa de upload
          const fileInfo = await FileSystem.getInfoAsync(ce.imageUri);
          if (fileInfo.exists) {
            needsUpload = true;
          }
        }

        // Se não for uma URL absoluta (http), montamos a URL do Supabase
        if (finalUri && !finalUri.startsWith('http') && !finalUri.startsWith('file://') && supabaseUrl) {
          finalUri = `${supabaseUrl}/storage/v1/object/public/${bucket}/${finalUri}`;
        }

        const resolvedUri = existing?.imageUri?.startsWith('file://') ? existing.imageUri : finalUri;
        
        if (needsUpload && resolvedUri.startsWith('file://')) {
          console.log(`🚀 [STORAGE] Corrigindo item ${ce.id}: Subindo foto local para a nuvem...`);
          const fileName = resolvedUri.split('/').pop() || `dogdex_${ce.id}.jpg`;
          const uploadedPath = await uploadImage(resolvedUri, fileName);
          if (uploadedPath) {
             // Atualiza o registro na nuvem imediatamente via push
             await syncService.push(token, [{ ...ce, imageUri: uploadedPath, status: 'synced' }]);
             console.log(`✅ [STORAGE] Foto do item ${ce.id} salva na nuvem com sucesso!`);
          }
        }

        console.log(`🖼️ [STORAGE] Syncing item ${ce.id}:`);
        console.log(`   - Original cloud URI: ${ce.imageUri}`);
        console.log(`   - Resolved local/cloud URI: ${resolvedUri}`);

        mergedMap.set(ce.id, {
          ...ce,
          imageUri: resolvedUri, 
          status: 'synced'
        });
      }

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Limpeza final: remove entradas locais que já foram sincronizadas como 'deleted'
      const finalSyncResults = merged.filter(e => e.status !== 'deleted');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalSyncResults));
      
      return { 
        pulled: cloudEntries.length, 
        pushed: pending.length 
      };
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }, [token]);

  return useMemo(() => ({ 
    saveEntry, 
    getEntries, 
    deleteEntry, 
    hasCompletedTour, 
    completeTour, 
    resetTour, 
    syncWithCloud 
  }), [token, saveEntry, getEntries, deleteEntry, syncWithCloud]);
}
