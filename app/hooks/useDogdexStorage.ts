import AsyncStorage from '@react-native-async-storage/async-storage';
import { documentDirectory, copyAsync, deleteAsync } from 'expo-file-system/legacy';
import { AnalyzeResult } from '@dogdex/shared';

export interface DogdexEntry {
  id: string;
  timestamp: string;
  breedName: string;
  confidence: number;
  locationAddr: string;
  imageUri: string;
  dogData: AnalyzeResult['dogData'];
}

const STORAGE_KEY = '@dogdex_history';

export function useDogdexStorage() {
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
        dogData: result.dogData
      };

      const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: DogdexEntry[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newEntry, ...existing];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  return { saveEntry, getEntries, deleteEntry };
}
