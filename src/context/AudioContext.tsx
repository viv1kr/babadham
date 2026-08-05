import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playTempleBell: () => void;
  playShankhChime: () => void;
}

const AudioContext = createContext<AudioContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playTempleBell: () => {},
  playShankhChime: () => {}
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API lazily on first user gesture if needed
    const saved = localStorage.getItem('bbp_sound_enabled');
    if (saved !== null) {
      setSoundEnabled(saved === 'true');
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('bbp_sound_enabled', String(next));
      return next;
    });
  };

  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        setAudioCtx(ctx);
        return ctx;
      }
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  // Synthesize realistic temple brass bell using Web Audio API harmonics
  const playTempleBell = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      masterGain.connect(ctx.destination);

      // Harmonics for rich temple bronze bell tone (fundamental F#5 ~ 740Hz)
      const frequencies = [739.99, 1479.98, 2219.97, 2959.96, 4440.0];
      const gains = [0.4, 0.25, 0.15, 0.1, 0.05];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Slight frequency bend for authentic brass resonance
        osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + 2.5);

        gainNode.gain.setValueAtTime(gains[idx], now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (2.5 - idx * 0.3));

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(now);
        osc.stop(now + 3.0);
      });
    } catch (e) {
      console.warn('Audio playback prevented or unsupported', e);
    }
  };

  // Synthesize a soft shankh / temple chime sound
  const playShankhChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now); // 432Hz sacred frequency
      osc.frequency.exponentialRampToValueAtTime(864, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(432, now + 1.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.1);
    } catch (e) {
      console.warn('Audio error', e);
    }
  };

  return (
    <AudioContext.Provider value={{ soundEnabled, toggleSound, playTempleBell, playShankhChime }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
