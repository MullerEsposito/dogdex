import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useDogdexSounds() {
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

    return () => {
      Object.values(sounds.current).forEach(snd => {
        if (snd && typeof snd.unloadAsync === 'function') snd.unloadAsync();
      });
    };
  }, []);

  const playSound = async (name: string) => {
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
