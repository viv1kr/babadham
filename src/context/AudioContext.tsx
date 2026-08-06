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

  // Synthesize new deep 432Hz sacred temple gong & crystal brass bell chime
  const playTempleBell = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Master output gain & warm low-pass filter decay
      const masterGain = ctx.createGain();
      const masterFilter = ctx.createBiquadFilter();

      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(7200, now);
      masterFilter.frequency.exponentialRampToValueAtTime(1100, now + 4.5);

      masterGain.gain.setValueAtTime(0.55, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      masterGain.connect(masterFilter);
      masterFilter.connect(ctx.destination);

      // 1. RICH BRASS CLAPPER STRIKE IMPACT
      const strikeBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.025, ctx.sampleRate);
      const outputData = strikeBuffer.getChannelData(0);
      for (let i = 0; i < strikeBuffer.length; i++) {
        outputData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.004));
      }
      const strikeSource = ctx.createBufferSource();
      strikeSource.buffer = strikeBuffer;
      const strikeFilter = ctx.createBiquadFilter();
      strikeFilter.type = 'bandpass';
      strikeFilter.frequency.setValueAtTime(3800, now);
      strikeFilter.Q.setValueAtTime(2.5, now);

      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.35, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      strikeSource.connect(strikeFilter);
      strikeFilter.connect(strikeGain);
      strikeGain.connect(masterFilter);
      strikeSource.start(now);

      // 2. 432Hz SACRED HARMONIC OVERTONES (Sub-Gong 216Hz, Base 432Hz, Octave 864Hz, 1296Hz, 1728Hz, 2592Hz)
      const modes = [
        { freq: 216.0, gain: 0.50, decay: 5.0, type: 'sine' as OscillatorType },    // Sub-Gong Resonance (Deep 216Hz)
        { freq: 432.0, gain: 0.60, decay: 4.6, type: 'sine' as OscillatorType },    // Sacred Fundamental 432Hz
        { freq: 864.0, gain: 0.40, decay: 3.8, type: 'sine' as OscillatorType },    // Octave 864Hz
        { freq: 1296.0, gain: 0.28, decay: 3.2, type: 'triangle' as OscillatorType },// Perfect Fifth (1296Hz)
        { freq: 1728.0, gain: 0.18, decay: 2.5, type: 'sine' as OscillatorType },   // 2nd Octave (1728Hz)
        { freq: 2592.0, gain: 0.10, decay: 1.8, type: 'triangle' as OscillatorType } // High Crystal Chime Ring
      ];

      // Chorusing Tremolo (4.8Hz pitch swell)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(4.8, now);
      lfoGain.gain.setValueAtTime(2.8, now);
      lfo.connect(lfoGain);
      lfo.start(now);
      lfo.stop(now + 5.0);

      modes.forEach((mode) => {
        const osc = ctx.createOscillator();
        const modeGain = ctx.createGain();

        osc.type = mode.type;
        osc.frequency.setValueAtTime(mode.freq, now);

        lfoGain.connect(osc.frequency);
        osc.frequency.exponentialRampToValueAtTime(mode.freq * 0.998, now + mode.decay);

        modeGain.gain.setValueAtTime(mode.gain, now);
        modeGain.gain.exponentialRampToValueAtTime(0.0001, now + mode.decay);

        osc.connect(modeGain);
        modeGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + mode.decay + 0.1);
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
