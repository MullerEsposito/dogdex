import * as Speech from 'expo-speech';
import { useState, useEffect } from 'react';
import { AnalyzeResult } from '@dogdex/shared';
import { useAudio } from '../context/AudioContext';


export function useDogdexSpeech() {
  const { isAudioEnabled } = useAudio();
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);

  // Load settings and find male voice on mount
  useEffect(() => {
    (async () => {
      try {
        // Find available voices
        const availableVoices = await Speech.getAvailableVoicesAsync();
        
        // Filtrar vozes em Português
        const ptVoices = availableVoices.filter(v => v.language.startsWith('pt'));
        
        // Tentar encontrar uma voz masculina conhecida
        const maleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('masculino') ||
          v.name.toLowerCase().includes('daniel') || 
          v.name.toLowerCase().includes('antonio') ||
          v.identifier.toLowerCase().includes('ptd-local') || 
          v.identifier.toLowerCase().includes('gfs-local')
        );

        if (maleVoice) {
          setSelectedVoice(maleVoice.identifier);
        } else if (ptVoices.length > 0) {
          setSelectedVoice(ptVoices[0].identifier);
        }

      } catch (e) {
        console.error('Failed to init speech', e);
      }
    })();
  }, []);

  // Immediate stop when audio is disabled
  useEffect(() => {
    if (!isAudioEnabled) {
      stopSpeech();
    }
  }, [isAudioEnabled]);

  const speakAnalyzeResult = (result: AnalyzeResult | null) => {
    if (!isAudioEnabled || !result) return;

    const breed = result.breed || 'Cachorro desconhecido';
    const confidence = Math.round((result.confidence || 0) * 100);
    const lifeRaw = result.dogData?.life || 'não informada';
    
    // Melhorar leitura da expectativa de vida (ex: "14-17" -> "14 a 17 anos")
    const lifeFormatted = lifeRaw === 'não informada' 
      ? lifeRaw 
      : `${lifeRaw.replace('-', ' a ').replace('–', ' a ')}`;
    
    let textToSpeak = '';
    if (result.error || !result.breed) {
      textToSpeak = `Não foi possível identificar a raça.`;
    } else {
      textToSpeak = `Análise concluída com ${confidence} por cento de confiança. Identificado: ${breed}. Expectativa de vida: ${lifeFormatted}.`;
    }

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
    isSpeechEnabled: isAudioEnabled,
    speakAnalyzeResult,
    stopSpeech
  };
}
