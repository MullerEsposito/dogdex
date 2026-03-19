import { DOG_BREEDS as breedKeywords } from '@dogdex/shared';
import { visionClient } from '../config/vision';
import { dogs } from '../data/dogs';

export class AnalyzeService {
  async analyzeImage(imagePath: string) {
    const [result] = await visionClient.labelDetection(imagePath);
    const labels = result.labelAnnotations;

    let bestBreed = null;

    if (!labels || labels.length === 0) {
      return {
        success: true,
        breed: 'Unknown',
        normalizedBreed: '',
        confidence: 0,
        alternatives: [],
        dogData: null
      };
    }

    for (const label of labels) {
      const desc = label.description?.toLowerCase() || '';

      const foundKeyword = breedKeywords.find((keyword) => desc.includes(keyword));

      if (foundKeyword) {
        bestBreed = label;
        break;
      }
    }

    if (!bestBreed) {
      bestBreed = labels.find(l =>
        l.description?.toLowerCase().includes('dog')
      );
    }

    const normalized = this.normalizeBreed(bestBreed?.description || '');
    const dogData = dogs[normalized] || null;
 
    return {
      success: true,
      breed: bestBreed?.description || 'Unknown',
      normalizedBreed: normalized,
      confidence: bestBreed?.score || 0,
      alternatives: labels.slice(0, 10).map(l => l.description || 'Unknown'),
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
