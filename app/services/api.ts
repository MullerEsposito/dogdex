export const analyzeDog = async (uri: string) => {
  const formData = new FormData();

  formData.append('image', {
    uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch('http://localhost:3000/analyze', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};