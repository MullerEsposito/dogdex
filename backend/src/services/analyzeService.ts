import { DOG_BREEDS as labels } from '@dogdex/shared';
import { dogs } from '../data/dogs';
import { getModel } from '../ml/model';

import fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';

const IMAGE_SIZE = 160;
const CONFIDENCE_THRESHOLD = 0.7;

export class AnalyzeService {
  async analyzeImage(imagePath: string) {
    const model = getModel();
    const imageBuffer = fs.readFileSync(imagePath);

    let tensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
      .expandDims(0)
      .toFloat();

    tensor = tensor.div(127.5).sub(1);

    const prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();

    const maxIndex = data.indexOf(Math.max(...data));
    const breed = labels[maxIndex] || 'Unknown';
    const confidence = data[maxIndex];

    const normalized = this.normalizeBreed(breed);
    const dogData = dogs[normalized] || null;

    if (confidence < CONFIDENCE_THRESHOLD) {
      return {
        success: false,
        error: 'Não foi possível identificar a raça com certeza',
        confidence,
        alternatives: Array.from(data)
          .map((score, index) => ({ breed: labels[index], score }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(a => a.breed),
        dogData: null
      };
    }

    return {
      success: true,
      breed,
      normalizedBreed: normalized,
      confidence,
      alternatives: Array.from(data)
        .map((score, index) => ({ breed: labels[index], score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(a => a.breed),
      dogData
    };
  }

  private normalizeBreed(name: string): string {
    const lower = name.toLowerCase();

    if (lower.includes('golden')) return 'golden retriever';
    if (lower.includes('labrador')) return 'labrador retriever';
    if (lower.includes('bulldog')) return 'bulldog';
    if (lower.includes('poodle')) return 'poodle';
    if (lower.includes('beagle')) return 'beagle';
    if (lower.includes('shepherd')) return 'german shepherd';
    if (lower.includes('husky')) return 'husky';
    if (lower.includes('chihuahua')) return 'chihuahua';

    // Comportamento padrão para termos genéricos
    if (lower === 'retriever') return 'golden retriever';
    if (lower === 'shepherd') return 'german shepherd';

    return lower;
  }
}

export const analyzeService = new AnalyzeService();
