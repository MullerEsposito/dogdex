import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, copyAsync, deleteAsync } from 'expo-file-system/legacy';
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
  status?: 'local' | 'synced' | 'deleted';
  localId?: string;
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
      const entries: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      // Oculta itens marcados como apagados da interface
      return entries.filter(e => e.status !== 'deleted');
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


  const syncWithCloud = async (): Promise<{ pulled: number, pushed: number }> => {
    if (!token) return { pulled: 0, pushed: 0 };
    
    try {
      // 1. Pega entradas locais
      const localStr = await AsyncStorage.getItem(STORAGE_KEY);
      const local: DogdexEntry[] = localStr ? JSON.parse(localStr) : [];
      
      // 2. Envia mudanças locais primeiro (importante para exclusões)
      const pending = local.filter(e => e.status !== 'synced');
      if (pending.length > 0) {
        await syncService.push(token, pending);
      }

      // 3. Agora baixa o estado atualizado da nuvem
      const cloudEntries = await syncService.pull(token);
      
      // 4. Mescla as entradas
      const mergedMap = new Map<string, DogdexEntry>();
      
      // Add local first
      local.forEach(e => mergedMap.set(e.id, { ...e, status: e.status || 'local' }));
      
      // Add cloud entries (overwriting local if same ID, marking as synced)
      cloudEntries.forEach(ce => {
        const existing = mergedMap.get(ce.id);
        
        // Se já existe localmente e está marcado como 'deleted', não sobrescrevemos
        if (existing?.status === 'deleted') return;

        mergedMap.set(ce.id, {
          ...ce,
          // Em pull do syncService, ce.id já foi mapeado do localId do servidor
          imageUri: existing?.imageUri || ce.imageUri, 
          status: 'synced'
        });
      });

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
  };

  return { 
    saveEntry, 
    getEntries, 
    deleteEntry, 
    hasCompletedTour, 
    completeTour, 
    resetTour, 
    syncWithCloud 
  };
}
