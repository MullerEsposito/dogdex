import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AnalyzeResult } from '@dogdex/shared';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:3000';
  
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000`;
  }
  
  return 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();

export const analyzeDog = async (uri: string): Promise<AnalyzeResult> => {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('image', blob, 'photo.jpg');
  } else {
    formData.append('image', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  }

  const response = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};