import * as tf from '@tensorflow/tfjs-node';
import path from 'path';

let model: tf.GraphModel;

export async function loadModel(): Promise<void> {
  const modelPath = path.join(process.cwd(), '..', 'model', 'dogdex_model_tfjs', 'model.json');
  model = await tf.loadGraphModel(`file://${modelPath}`);
  console.log('Modelo carregado 🚀');
}

export function getModel(): tf.GraphModel {
  if (!model) {
    throw new Error('Modelo ainda não carregado');
  }
  return model;
}