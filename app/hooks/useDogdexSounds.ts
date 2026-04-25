import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useAudio } from '../context/AudioContext';

export function useDogdexSounds() {
  const { isAudioEnabled } = useAudio();
  
  const pPowerOn = useAudioPlayer(require('../assets/sounds/power_on.wav'));
  const pPowerOff = useAudioPlayer(require('../assets/sounds/power_off.wav'));
  const pLoading = useAudioPlayer(require('../assets/sounds/loading.wav'));
  const pSuccess = useAudioPlayer(require('../assets/sounds/success.wav'));
  const pError = useAudioPlayer(require('../assets/sounds/error.wav'));

  // Configure looping for loading sound
  useEffect(() => {
    if (pLoading) {
      pLoading.loop = true;
    }
  }, [pLoading]);

  // Immediate stop when audio is disabled
  useEffect(() => {
    if (!isAudioEnabled) {
      stopLoadingSound();
      [pPowerOn, pPowerOff, pLoading, pSuccess, pError].forEach(player => {
        try { player.pause(); } catch(e) {}
      });
    }
  }, [isAudioEnabled]);

  const playSound = async (name: string) => {
    if (!isAudioEnabled) return;
    
    const players: { [key: string]: any } = { 
      powerOn: pPowerOn, 
      powerOff: pPowerOff, 
      loading: pLoading, 
      success: pSuccess, 
      error: pError 
    };

    try {
      const player = players[name];
      if (player) {
        if (name !== 'loading') {
          player.seekTo(0);
          player.play();
        } else {
          player.play();
        }
      }
    } catch(e) {}
  };

  const stopLoadingSound = async () => {
    try {
      if (pLoading) {
        pLoading.pause();
        pLoading.seekTo(0);
      }
    } catch(e) {}
  };

  return { playSound, stopLoadingSound };
}
