import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useAudio } from '../context/AudioContext';

export function useDogdexSounds() {
  const { isAudioEnabled } = useAudio();
  const sounds = useRef<{ [key: string]: Audio.Sound }>({});

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: sPowerOn } = await Audio.Sound.createAsync(require('../assets/sounds/power_on.wav'));
        const { sound: sPowerOff } = await Audio.Sound.createAsync(require('../assets/sounds/power_off.wav'));
        const { sound: sLoading } = await Audio.Sound.createAsync(require('../assets/sounds/loading.wav'), { isLooping: true });
        const { sound: sSuccess } = await Audio.Sound.createAsync(require('../assets/sounds/success.wav'));
        const { sound: sError } = await Audio.Sound.createAsync(require('../assets/sounds/error.wav'));

        sounds.current = { powerOn: sPowerOn, powerOff: sPowerOff, loading: sLoading, success: sSuccess, error: sError };
      } catch (err) {
        console.warn("Audio assets missing or error loading:", err);
      }
    };
    loadSounds();
  }, []);

  // Immediate stop when audio is disabled
  useEffect(() => {
    if (!isAudioEnabled) {
      stopLoadingSound();
      Object.values(sounds.current).forEach(snd => {
        try { snd.stopAsync(); } catch(e) {}
      });
    }
  }, [isAudioEnabled]);

  const playSound = async (name: string) => {
    if (!isAudioEnabled) return;
    try {
      const snd = sounds.current[name];
      if (snd) {
        if (name !== 'loading') {
          await snd.replayAsync();
        } else {
          await snd.playAsync();
        }
      }
    } catch(e) {}
  };

  const stopLoadingSound = async () => {
    try {
      if (sounds.current.loading) {
        await sounds.current.loading.stopAsync();
      }
    } catch(e) {}
  };

  return { playSound, stopLoadingSound };
}
