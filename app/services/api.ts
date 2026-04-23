import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AnalyzeResult } from '@dogdex/shared';

const getBaseUrl = () => {
  // 1. Tenta o valor injetado pelo app.config.js (definido no build)
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  
  // 2. Tenta a variável de ambiente direta (vinda do cross-env ou .env)
  const publicUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log(`[DEBUG] configUrl: ${configUrl}, publicUrl: ${publicUrl}, OS: ${Platform.OS}`);

  const url = configUrl || publicUrl;
  if (url) return url;

  // 3. Se não houver URL definida, tenta auto-detectar para Android
  if (Platform.OS !== 'web') {
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:3000`;
    }
  }
  
  // 4. Fallback final para qualquer plataforma
  return 'http://localhost:3000';
};

export const BASE_URL = getBaseUrl();
console.log(`🚀 [DOGDEX] API BASE_URL DEFINIDA COMO: ${BASE_URL}`);
console.log(`[API] Base URL configurada: ${BASE_URL} 🌐`);

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

export const sendSupportReport = async (
  report: { 
    type: 'bug' | 'feature'; 
    text: string; 
    userName?: string;
    userEmail?: string;
    deviceInfo?: any 
  },
  screenshotUri?: string
): Promise<{ success: boolean; message?: string; error?: string; previewUrl?: string }> => {
  const formData = new FormData();
  formData.append('type', report.type);
  formData.append('text', report.text);
  if (report.userName) formData.append('userName', report.userName);
  if (report.userEmail) formData.append('userEmail', report.userEmail);
  formData.append('deviceInfo', JSON.stringify(report.deviceInfo));

  if (screenshotUri) {
    if (Platform.OS === 'web') {
      const response = await fetch(screenshotUri);
      const blob = await response.blob();
      formData.append('screenshot', blob, 'screenshot.jpg');
    } else {
      formData.append('screenshot', {
        uri: screenshotUri,
        name: 'screenshot.jpg',
        type: 'image/jpeg',
      } as any);
    }
  }

  const response = await fetch(`${BASE_URL}/support`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
};