import { useCallback, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useAudio } from '../context/AudioContext';

// Sound sources map
const SOUND_SOURCES: Record<string, any> = {
  powerOn: require('../assets/sounds/power_on.wav'),
  powerOff: require('../assets/sounds/power_off.wav'),
  loading: require('../assets/sounds/loading.wav'),
  success: require('../assets/sounds/success.wav'),
  error: require('../assets/sounds/error.wav'),
};

export function useDogdexSounds() {
  const { isAudioEnabled } = useAudio();
  // Single player instance — only 1 native ExoPlayer + MediaSession
  const player = useAudioPlayer(null);
  const currentSoundRef = useRef<string | null>(null);

  const playSound = useCallback((name: string) => {
    if (!isAudioEnabled) return;

    const source = SOUND_SOURCES[name];
    if (!source || !player) return;

    try {
      // Stop current playback before switching
      player.pause();
      
      // Replace the audio source without creating a new native player
      player.replace(source);
      currentSoundRef.current = name;

      if (name === 'loading') {
        player.loop = true;
      } else {
        player.loop = false;
      }

      player.play();
    } catch {
      console.warn('Erro ao carregar sons do Dogdex');
    }
  }, [isAudioEnabled, player]);

  const stopLoadingSound = useCallback(() => {
    try {
      if (player && currentSoundRef.current === 'loading') {
        player.pause();
        currentSoundRef.current = null;
      }
    } catch {
      // ignore
    }
  }, [player]);

  return { playSound, stopLoadingSound };
}
