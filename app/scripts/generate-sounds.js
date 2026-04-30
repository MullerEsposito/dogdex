/* global __dirname */
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

function createWav(filename, samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // FMT sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // DATA sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const val = sample < 0 ? sample * 32768 : sample * 32767;
    buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
  }

  const rootDir = path.join(__dirname, '../assets/sounds');
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  const dest = path.join(rootDir, filename);
  fs.writeFileSync(dest, buffer);
  console.log('Saved', dest);
}

// 1. Power On: Sweep 200Hz -> 800Hz
const powerOn = [];
for (let i = 0; i < 44100 * 0.4; i++) {
  const t = i / 44100;
  const freq = 200 + (600 * t / 0.4);
  powerOn.push(Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2));
}
createWav('power_on.wav', powerOn);

// 2. Power Off: Sweep 800Hz -> 100Hz
const powerOff = [];
for (let i = 0; i < 44100 * 0.4; i++) {
  const t = i / 44100;
  const freq = 800 - (700 * t / 0.4);
  powerOff.push(Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 4));
}
createWav('power_off.wav', powerOff);

// 3. Loading: Repeating fast radar blips
const loading = [];
for (let i = 0; i < 44100 * 0.8; i++) {
  const t = i / 44100;
  // blip every 0.1s
  const env = (i % 4410) < 1000 ? 1 : 0;
  const freq = 1200; // high pitch
  loading.push(Math.sin(2 * Math.PI * freq * t) * env * 0.3);
}
createWav('loading.wav', loading);

// 4. Success: Ding Ding
const success = [];
for (let i = 0; i < 44100 * 0.6; i++) {
  const t = i / 44100;
  let freq = 800;
  let env = 0;
  if (t < 0.2) {
    freq = 600;
    env = Math.exp(-t * 15);
  } else if (t < 0.6) {
    freq = 900;
    env = Math.exp(-(t - 0.2) * 10);
  }
  success.push(Math.sin(2 * Math.PI * freq * t) * env * 0.7);
}
createWav('success.wav', success);

// 5. Error: Low Buzz
const err = [];
for (let i = 0; i < 44100 * 0.5; i++) {
  const t = i / 44100;
  // saw wave around 150 Hz
  const freq = 150;
  const val = 2 * (t * freq - Math.floor(0.5 + t * freq));
  err.push(val * Math.exp(-t * 5) * 0.8);
}
createWav('error.wav', err);
