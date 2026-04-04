import { useState, useCallback, useEffect, useRef } from "react";
import { rounds } from "@/data/rounds";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const allQuestions = rounds.flatMap((r) => r.questions);

export interface GameState {
  currentQ: number;
  revealedAnswers: boolean[];
  strikes: number;
  teamScores: [number, number];
  gameOver: boolean;
}

function initialState(): GameState {
  return {
    currentQ: 0,
    revealedAnswers: new Array(allQuestions[0].answers.length).fill(false),
    strikes: 0,
    teamScores: [0, 0],
    gameOver: false,
  };
}

const CHANNEL_NAME = "family-feud-sync";

export function useGameState(role: "host" | "board" | "standalone") {
  const [state, setState] = useState<GameState>(initialState);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const { playCorrect, playStrike } = useSoundEffects();

  // Set up broadcast channel for host<->board sync
  useEffect(() => {
    if (role === "standalone") return;
    const ch = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = ch;

    ch.onmessage = (e) => {
      const msg = e.data as { type: string; state: GameState; sound?: string };
      if (msg.type === "sync") {
        setState(msg.state);
        if (role === "board" && msg.sound === "correct") playCorrect();
        if (role === "board" && msg.sound === "strike") playStrike();
      }
    };

    // Board requests initial state from host
    if (role === "board") {
      ch.postMessage({ type: "request-state" });
    }

    return () => ch.close();
  }, [role, playCorrect, playStrike]);

  const broadcast = useCallback(
    (newState: GameState, sound?: string) => {
      channelRef.current?.postMessage({ type: "sync", state: newState, sound });
    },
    []
  );

  // Host responds to board state requests
  useEffect(() => {
    if (role !== "host") return;
    const ch = channelRef.current;
    if (!ch) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "request-state") {
        ch.postMessage({ type: "sync", state });
      }
    };
    ch.addEventListener("message", handler);
    return () => ch.removeEventListener("message", handler);
  }, [role, state]);

  const question = allQuestions[state.currentQ];
  const roundPoints = question.answers.reduce(
    (sum, a, i) => (state.revealedAnswers[i] ? sum + a.points : sum),
    0
  );

  const revealAnswer = useCallback(
    (index: number) => {
      setState((prev) => {
        if (prev.revealedAnswers[index]) return prev;
        const next = { ...prev, revealedAnswers: [...prev.revealedAnswers] };
        next.revealedAnswers[index] = true;
        if (role !== "board") playCorrect();
        broadcast(next, "correct");
        return next;
      });
    },
    [playCorrect, broadcast, role]
  );

  const revealAll = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, revealedAnswers: prev.revealedAnswers.map(() => true) };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const addStrike = useCallback(() => {
    setState((prev) => {
      if (prev.strikes >= 3) return prev;
      const next = { ...prev, strikes: prev.strikes + 1 };
      if (role !== "board") playStrike();
      broadcast(next, "strike");
      return next;
    });
  }, [playStrike, broadcast, role]);

  const resetStrikes = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, strikes: 0 };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQ >= allQuestions.length - 1) {
        const next = { ...prev, gameOver: true };
        broadcast(next);
        return next;
      }
      const nextQ = prev.currentQ + 1;
      const next: GameState = {
        ...prev,
        currentQ: nextQ,
        revealedAnswers: new Array(allQuestions[nextQ].answers.length).fill(false),
        strikes: 0,
      };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const addScore = useCallback(
    (team: 0 | 1, points: number) => {
      setState((prev) => {
        const scores: [number, number] = [...prev.teamScores];
        scores[team] += points;
        const next = { ...prev, teamScores: scores };
        broadcast(next);
        return next;
      });
    },
    [broadcast]
  );

  const resetGame = useCallback(() => {
    const s = initialState();
    setState(s);
    broadcast(s);
  }, [broadcast]);

  return {
    ...state,
    question,
    roundPoints,
    allQuestions,
    revealAnswer,
    revealAll,
    addStrike,
    resetStrikes,
    nextQuestion,
    addScore,
    resetGame,
  };
}
