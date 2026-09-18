'use client';

import React, { useState, useEffect, useRef } from 'react';

export function PalazzoAmbiencePlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const chordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fountainNodesRef = useRef<{ noise: AudioNode; filter: BiquadFilterNode; gain: GainNode } | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);

    audioCtxRef.current = ctx;
    masterGainRef.current = masterGain;
  };

  const startFountainSound = (ctx: AudioContext, masterGain: GainNode) => {
    // Generate pink-noise for a soft, soothing fountain / courtyard water flow
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle bandpass filter for water fountain frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const fountainGain = ctx.createGain();
    fountainGain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(fountainGain);
    fountainGain.connect(masterGain);

    whiteNoise.start(0);
    fountainNodesRef.current = { noise: whiteNoise, filter, gain: fountainGain };
  };

  const playChimeNote = (ctx: AudioContext, masterGain: GainNode, freq: number, delay = 0) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    const now = ctx.currentTime + delay;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.5);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 4.6);
  };

  const startChordCycle = (ctx: AudioContext, masterGain: GainNode) => {
    // Serene Milanese spa harmonic chords (E Major 9th / Tuscan Pentatonic)
    const chordProgressions = [
      [164.81, 246.94, 329.63, 415.30, 493.88], // E3, B3, E4, G#4, B4
      [220.00, 277.18, 329.63, 440.00, 554.37], // A3, C#4, E4, A4, C#5
      [185.00, 277.18, 369.99, 440.00, 554.37], // F#3, C#4, F#4, A4, C#5
      [246.94, 329.63, 392.00, 493.88, 587.33], // B3, E4, G4, B4, D5
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      const chord = chordProgressions[chordIndex % chordProgressions.length];
      chord.forEach((freq, idx) => {
        playChimeNote(ctx, masterGain, freq, idx * 0.45);
      });
      chordIndex++;
    };

    playNextChord();
    chordIntervalRef.current = setInterval(playNextChord, 6000);
  };

  const startAmbience = async () => {
    initAudio();
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    startFountainSound(ctx, masterGain);
    startChordCycle(ctx, masterGain);

    // Fade in master volume
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 1.8);

    setIsPlaying(true);
  };

  const stopAmbience = () => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;

    if (chordIntervalRef.current) {
      clearInterval(chordIntervalRef.current);
      chordIntervalRef.current = null;
    }

    if (ctx && masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      setTimeout(() => {
        if (fountainNodesRef.current) {
          try {
            (fountainNodesRef.current.noise as AudioBufferSourceNode).stop();
          } catch {
            // Already stopped
          }
          fountainNodesRef.current = null;
        }
      }, 900);
    }

    setIsPlaying(false);
  };

  const toggleAmbience = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  return (
    <button
      onClick={toggleAmbience}
      aria-pressed={isPlaying}
      title={isPlaying ? 'Mute Palazzo Ambience' : 'Enable Sensory Ambience (Soft Courtyard Fountain & Harmonics)'}
      aria-label={isPlaying ? 'Mute Palazzo Ambience' : 'Enable Sensory Ambience'}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-label uppercase tracking-wider font-semibold transition-all duration-300 select-none ${
        isPlaying
          ? 'bg-gold-surface border border-gold text-gold shadow-sm'
          : 'bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:border-gold-border'
      }`}
    >
      {/* Animated 3-Bar Soundwave Equalizer */}
      <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 pb-[1px]" aria-hidden="true">
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isPlaying ? 'bg-gold animate-[soundwave-1_0.9s_ease-in-out_infinite]' : 'bg-muted-foreground/50 h-1.5'
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isPlaying ? 'bg-gold animate-[soundwave-2_0.75s_ease-in-out_infinite_0.15s]' : 'bg-muted-foreground/50 h-2.5'
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isPlaying ? 'bg-gold animate-[soundwave-3_1.1s_ease-in-out_infinite_0.3s]' : 'bg-muted-foreground/50 h-1'
          }`}
        />
      </div>

      <span className="text-[10.5px] tracking-widest hidden sm:inline">
        {isPlaying ? 'Palazzo Ambience' : 'Ambience'}
      </span>

      {/* Subtle indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          isPlaying ? 'bg-gold animate-ping' : 'bg-muted-foreground/40'
        }`}
      />
    </button>
  );
}
