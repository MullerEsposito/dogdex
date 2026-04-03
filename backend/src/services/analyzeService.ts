import { DOG_BREEDS as labels } from '@dogdex/shared';
import { dogs } from '../data/dogs';
import { getModel } from '../ml/model';

import fs from 'fs';
import path from 'path';
import * as tf from '@tensorflow/tfjs-node';

const DEFAULT_LABELS = labels;
const MODEL_DIR = '../model/dogdex_model_tfjs';
const CONFIDENCE_THRESHOLD = 0.3;

export class AnalyzeService {
  private activeLabels: string[] = DEFAULT_LABELS;

  constructor() {
    this.loadExternalLabels();
  }

  private loadExternalLabels() {
    try {
      const labelsPath = path.resolve(__dirname, '../../../model/dogdex_model_tfjs/labels.json');
      if (fs.existsSync(labelsPath)) {
        const content = fs.readFileSync(labelsPath, 'utf8');
        this.activeLabels = JSON.parse(content);
        console.log(`✅ Carregadas ${this.activeLabels.length} raças do labels.json`);
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível carregar labels.json, usando padrão.', error);
    }
  }

  async analyzeImage(imagePath: string) {
    const model = getModel();
    const imageBuffer = fs.readFileSync(imagePath);

    // Se o labels.json existir, assumimos que é o novo modelo EfficientNet (224x224)
    // Caso contrário, usamos o padrão do MobileNetV2 (160x160)
    const isNewModel = this.activeLabels !== DEFAULT_LABELS;
    const currentSize = isNewModel ? 224 : 160;

    let tensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeBilinear([currentSize, currentSize])
      .expandDims(0)
      .toFloat();

    // EfficientNetB0 espera valores [0, 255], MobileNetV2 esperava [-1, 1]
    if (!isNewModel) {
      tensor = tensor.div(127.5).sub(1);
    }

    const prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();

    const predictions = Array.from(data)
      .map((score, index) => ({
        breed: this.activeLabels[index] || `unknown-${index}`,
        score
      }))
      .sort((a, b) => b.score - a.score);

    const top1 = predictions[0] || { breed: 'unknown', score: 0 };

    const rawBreed = top1.breed;
    const breed = this.cleanLabel(rawBreed);
    const confidence = top1.score;
    const top3 = predictions.slice(0, 3);

    const normalized = this.normalizeBreed(breed);
    const dogData = dogs[normalized] || {
      name: breed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      temperament: ["Informação pendente"],
      energy: "N/A",
      size: "N/A",
      life: "N/A",
      origin: "N/A",
      group: "N/A",
      image: `https://images.dog.ceo/breeds/${breed.replace(' ', '-')}/n02084071_0.jpg` // Fallback image attempt
    };

    if (confidence < CONFIDENCE_THRESHOLD) {
      return {
        success: false,
        error: 'Não foi possível identificar a raça com certeza',
        confidence,
        alternatives: top3.map(p => p.breed),
        dogData: null
      };
    }

    return {
      success: true,
      breed,
      normalizedBreed: normalized,
      confidence,
      alternatives: top3.map(p => p.breed),
      dogData
    };
  }

  private normalizeBreed(name?: string): string {
    if (!name) return 'desconhecido';
    
    const lower = name.toLowerCase().trim();
    
    // Se ainda tiver o prefixo (ex: n02099601-), extraímos o nome real
    const cleanName = lower.includes('-') ? lower.split('-').slice(1).join('-') : lower;
    const finalName = cleanName.replace(/_/g, ' ');

    if (finalName === 'shih') return 'shih tzu';

    // Mapping for specific model labels to database keys
    if (lower === 'shih') return 'shih tzu';
    if (lower === 'german short') return 'german shorthaired pointer';
    if (lower === 'ccurly') return 'curly-coated retriever';
    if (lower === 'flat') return 'flat-coated retriever';
    if (lower === 'soft') return 'soft-coated wheaten terrier';
    if (lower === 'wire') return 'wire-haired fox terrier';
    if (lower === 'black') return 'black-and-tan coonhound';

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

    return finalName;
  }

  private cleanLabel(label: string): string {
    // Remove o prefixo n020xxxxx- e troca underlines por espaços
    const cleaned = label.replace(/^n\d+-/, '').replace(/_/g, ' ');
    // Capitalize words
    return cleaned.split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}

export const analyzeService = new AnalyzeService();
