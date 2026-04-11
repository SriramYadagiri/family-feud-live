import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import player1Img from "@/assets/player-1.png";
import player2Img from "@/assets/player-2.png";
import player1Sound from "@/assets/player-1-intro.mp3";
import player2Sound from "@/assets/player-2-intro.mp3";
import { TEAM_NAMES } from "@/hooks/useGameState";

const playerImages = [player1Img, player2Img];
const player1Audio = new Audio(player1Sound);
const player2Audio = new Audio(player2Sound);

interface PlayerRevealOverlayProps {
  revealPlayer: 0 | 1 | null;
  onComplete: () => void;
}

function playSoundBite(player: 0 | 1) {
  const audio = player === 0 ? player1Audio : player2Audio;
  // restart from beginning every time
  audio.currentTime = 0;

  // play audio
  audio.play().catch((e) => console.log("Audio play failed:", e));

  // stop after 5 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 5000);
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
    playSoundBite(revealPlayer);

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
