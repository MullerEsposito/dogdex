import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_SETTINGS_KEY = '@dogdex_audio_enabled';

interface AudioContextType {
  isAudioEnabled: boolean;
  toggleAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(AUDIO_SETTINGS_KEY);
        if (saved !== null) {
          setIsAudioEnabled(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load audio settings', e);
      }
    };
    loadSettings();
  }, []);

  const toggleAudio = async () => {
    const nextValue = !isAudioEnabled;
    setIsAudioEnabled(nextValue);
    try {
      await AsyncStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(nextValue));
    } catch (e) {
      console.error('Failed to save audio settings', e);
    }
  };

  return (
    <AudioContext.Provider value={{ isAudioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
