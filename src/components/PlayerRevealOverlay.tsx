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

function playBoomSound() {
  const ctx = new AudioContext();
  // Low boom
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.6);

  // Rising whoosh
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sawtooth";
  osc2.frequency.setValueAtTime(100, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
  gain2.gain.setValueAtTime(0.15, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.5);

  // Impact hit
  setTimeout(() => {
    const noise = ctx.createOscillator();
    const ng = ctx.createGain();
    noise.type = "square";
    noise.frequency.value = 40;
    ng.gain.setValueAtTime(0.5, ctx.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    noise.connect(ng).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.3);
  }, 300);
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
    playBoomSound();

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
