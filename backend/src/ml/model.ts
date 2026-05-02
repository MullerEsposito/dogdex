import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs';

let model: tf.GraphModel;

export async function loadModel(): Promise<void> {
  const possiblePaths = [
    path.join(process.cwd(), 'model', 'dogdex_model_tfjs', 'model.json'),
    path.join(process.cwd(), '..', 'model', 'dogdex_model_tfjs', 'model.json'),
    // Para quando rodamos via npm run dev no monorepo
    path.join(process.cwd(), 'backend', 'src', 'shared', 'model', 'dogdex_model_tfjs', 'model.json')
  ];

  let modelPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      modelPath = p;
      break;
    }
  }

  if (!modelPath) {
    throw new Error(`Não foi possível encontrar o modelo em: ${possiblePaths.join(', ')}`);
  }

  model = await tf.loadGraphModel(`file://${modelPath}`);
  console.log(`✅ [MODEL] Modelo carregado de: ${modelPath} 🚀`);
}

export function getModel(): tf.GraphModel {
  if (!model) {
    throw new Error('Modelo ainda não carregado');
  }
  return model;
}