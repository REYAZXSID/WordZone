
'use client';

import { useState, useEffect, useCallback } from 'react';

type SoundType =
  | 'click'
  | 'correct'
  | 'victory'
  | 'error'
  | 'swoosh'
  | 'coin'
  | 'purchase'
  | 'reward'
  | 'mission'
  | 'achievement'
  | 'powerup';

// In a real app, these would point to actual audio files in /public
const soundMap: Record<SoundType, string> = {
  click: '/sounds/click.wav',
  correct: '/sounds/correct.wav',
  victory: '/sounds/victory.mp3',
  error: '/sounds/error.wav',
  swoosh: '/sounds/swoosh.wav',
  coin: '/sounds/coin.wav',
  purchase: '/sounds/purchase.wav',
  reward: '/sounds/reward.wav',
  mission: '/sounds/mission.wav',
  achievement: '/sounds/achievement.mp3',
  powerup: '/sounds/powerup.wav',
};

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const savedSound = localStorage.getItem('crypto-sound');
    if (savedSound) {
      setSoundEnabled(JSON.parse(savedSound));
    }

    // Preload sounds
    if (JSON.parse(savedSound || 'true')) {
        for (const key in soundMap) {
            if (!audioCache[key as SoundType]) {
                const audio = new Audio(soundMap[key as SoundType]);
                audio.preload = 'auto';
                audioCache[key as SoundType] = audio;
            }
        }
    }

    const handleStorageChange = () => {
      const updatedSound = localStorage.getItem('crypto-sound');
      setSoundEnabled(updatedSound ? JSON.parse(updatedSound) : true);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    if (soundEnabled) {
      // To make this work, create a /public/sounds folder and add the audio files.
      const audio = audioCache[sound];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(error => {
            // This can happen if the user hasn't interacted with the page yet.
            // It's a browser security feature.
            console.error(`Could not play sound "${sound}":`, error);
        });
      } else {
         console.warn(`Sound "${sound}" not found in cache. It might not be preloaded.`);
         const newAudio = new Audio(soundMap[sound]);
         newAudio.play().catch(error => {
            console.error(`Could not play sound "${sound}":`, error);
        });
      }
    }
  }, [soundEnabled]);

  return playSound;
};
