import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import player1Img from "@/assets/player-1.png";
import player2Img from "@/assets/player-2.png";
import { TEAM_NAMES } from "@/hooks/useGameState";

const playerImages = [player1Img, player2Img];

interface PlayerRevealOverlayProps {
  revealPlayer: 0 | 1 | null;
  onComplete: () => void;
}

function playApplause() {
  const ctx = new AudioContext();
  const duration = 3;
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      // Layered filtered noise to simulate clapping crowd
      const noise = (Math.random() * 2 - 1);
      // Envelope: fade in quickly, sustain, fade out
      const envelope =
        t < 0.2 ? t / 0.2 :
        t < 2.2 ? 1.0 :
        1.0 - (t - 2.2) / 0.8;
      // Add rhythmic "clap" pulses
      const clapRate = 6 + Math.sin(t * 0.5) * 2;
      const clapPulse = 0.6 + 0.4 * Math.abs(Math.sin(t * clapRate * Math.PI));
      data[i] = noise * envelope * clapPulse * 0.3;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Bandpass filter to make it sound more like clapping
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = 0.8;

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

function fireConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#FFD700", "#FF6B35", "#00D4FF", "#FF3366"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#FFD700", "#FF6B35", "#00D4FF", "#FF3366"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  // Big burst
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#FFD700", "#FF6B35", "#00D4FF", "#FF3366", "#A855F7"],
    });
  }, 400);
}

export default function PlayerRevealOverlay({ revealPlayer, onComplete }: PlayerRevealOverlayProps) {
  const [phase, setPhase] = useState<"idle" | "growing" | "full" | "fading">("idle");
  const timerRef = useRef<number>();

  useEffect(() => {
    if (revealPlayer === null) {
      setPhase("idle");
      return;
    }

    // Start the reveal
    setPhase("growing");
    playApplause();

    // After grow animation, show full + confetti
    timerRef.current = window.setTimeout(() => {
      setPhase("full");
      fireConfetti();
    }, 600);

    // Start fading
    const t2 = window.setTimeout(() => {
      setPhase("fading");
    }, 3500);

    // Complete
    const t3 = window.setTimeout(() => {
      setPhase("idle");
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [revealPlayer, onComplete]);

  if (phase === "idle" || revealPlayer === null) return null;

  const img = playerImages[revealPlayer];
  const name = TEAM_NAMES[revealPlayer];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={img}
        alt={name}
        className={`object-contain transition-all ${
          phase === "growing"
            ? "h-0 w-0 scale-0 animate-none"
            : "h-[70vh] w-auto"
        }`}
        style={{
          animation:
            phase === "growing"
              ? "reveal-grow 0.6s ease-out forwards"
              : undefined,
        }}
      />
      <div
        className={`font-display text-4xl md:text-6xl text-primary uppercase tracking-widest mt-4 transition-opacity duration-300 ${
          phase === "full" ? "opacity-100" : "opacity-0"
        }`}
      >
        {name}
      </div>
    </div>
  );
}
