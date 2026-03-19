import vision from '@google-cloud/vision';

// Instância do cliente do Google Cloud Vision
export const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: 'google-credentials.json'
});
