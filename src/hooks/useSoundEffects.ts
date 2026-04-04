import { useCallback, useRef } from "react";

const audioCtxRef = { current: null as AudioContext | null };

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  return audioCtxRef.current;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useSoundEffects() {
  const playCorrect = useCallback(() => {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 100);
    setTimeout(() => playTone(784, 0.3), 200);
  }, []);

  const playStrike = useCallback(() => {
    playTone(180, 0.5, "sawtooth", 0.2);
    setTimeout(() => playTone(140, 0.6, "sawtooth", 0.15), 150);
  }, []);

  return { playCorrect, playStrike };
}
