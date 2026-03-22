import * as tf from '@tensorflow/tfjs-node';

let model: tf.GraphModel;

export async function loadModel(): Promise<void> {
  model = await tf.loadGraphModel(
    'file://../model/dogdex_model_tfjs/model.json'
  );
  console.log('Modelo carregado 🚀');
}

export function getModel(): tf.GraphModel {
  if (!model) {
    throw new Error('Modelo ainda não carregado');
  }
  return model;
}