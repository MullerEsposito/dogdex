import { Platform } from 'react-native';

export const analyzeDog = async (uri: string) => {
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

  const response = await fetch('http://localhost:3000/analyze', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};