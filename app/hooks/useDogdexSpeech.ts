import * as Speech from 'expo-speech';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyzeResult } from '@dogdex/shared';

const SPEECH_SETTINGS_KEY = '@dogdex_speech_enabled';

export function useDogdexSpeech() {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);

  // Load settings and find male voice on mount
  useEffect(() => {
    (async () => {
      try {
        // Load settings
        const saved = await AsyncStorage.getItem(SPEECH_SETTINGS_KEY);
        if (saved !== null) {
          setIsSpeechEnabled(JSON.parse(saved));
        }

        // Find available voices
        const availableVoices = await Speech.getAvailableVoicesAsync();
        
        // Filtrar vozes em Português
        const ptVoices = availableVoices.filter(v => v.language.startsWith('pt'));
        
        // Tentar encontrar uma voz masculina conhecida
        // No Android (Google) as masculinas geralmente são 'pt-br-x-ptd-local' ou similares
        // No iOS, nomes como 'Daniel' ou vozes que contém 'male'
        const maleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('masculino') ||
          v.name.toLowerCase().includes('daniel') || // Voz clássica masculina iOS
          v.name.toLowerCase().includes('antonio') ||
          v.identifier.toLowerCase().includes('ptd-local') || // Google PT-BR Masculino
          v.identifier.toLowerCase().includes('gfs-local')    // Google PT-BR Alternativa
        );

        if (maleVoice) {
          setSelectedVoice(maleVoice.identifier);
        } else if (ptVoices.length > 0) {
          // Se não achar explicitamente 'male', pega a primeira de PT (fallback)
          setSelectedVoice(ptVoices[0].identifier);
        }

      } catch (e) {
        console.error('Failed to init speech', e);
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
      voice: selectedVoice, // Usa a voz travada (masculina se encontrada)
      pitch: 0.9, // Um pouco mais grave para reforçar o tom masculino
      rate: 1.5,
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
