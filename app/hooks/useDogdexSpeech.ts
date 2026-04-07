import * as Speech from 'expo-speech';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeResult } from '@dogdex/shared';

const SPEECH_SETTINGS_KEY = '@dogdex_speech_enabled';

export function useDogdexSpeech() {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SPEECH_SETTINGS_KEY);
        if (saved !== null) {
          setIsSpeechEnabled(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load speech settings', e);
      }
    })();
  }, []);

  const toggleSpeech = async () => {
    const nextValue = !isSpeechEnabled;
    setIsSpeechEnabled(nextValue);
    try {
      await AsyncStorage.setItem(SPEECH_SETTINGS_KEY, JSON.stringify(nextValue));
    } catch (e) {
      console.error('Failed to save speech settings', e);
    }
  };

  const speakAnalyzeResult = (result: AnalyzeResult | null) => {
    if (!isSpeechEnabled || !result || result.error) return;

    const breed = result.breed || 'Cachorro desconhecido';
    const confidence = Math.round((result.confidence || 0) * 100);
    const lifeRaw = result.dogData?.life || 'não informada';
    
    // Melhorar leitura da expectativa de vida (ex: "14-17" -> "14 a 17 anos")
    const lifeFormatted = lifeRaw === 'não informada' 
      ? lifeRaw 
      : `${lifeRaw.replace('-', ' a ').replace('–', ' a ')}`;
    
    const textToSpeak = `Análise concluída com ${confidence} por cento de confiança. Identificado: ${breed}. Expectativa de vida: ${lifeFormatted}.`;

    Speech.speak(textToSpeak, {
      language: 'pt-BR',
      pitch: 1.2,
      rate: 2,
    });
  };

  const stopSpeech = () => {
    Speech.stop();
  };

  return {
    isSpeechEnabled,
    toggleSpeech,
    speakAnalyzeResult,
    stopSpeech
  };
}
