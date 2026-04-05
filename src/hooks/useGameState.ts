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
  activeTeam: 0 | 1;
  stealMode: boolean;
  pointsLog: { team: 0 | 1; points: number; question: number }[];
}

function initialState(): GameState {
  return {
    currentQ: 0,
    revealedAnswers: new Array(allQuestions[0].answers.length).fill(false),
    strikes: 0,
    teamScores: [0, 0],
    gameOver: false,
    activeTeam: 0,
    stealMode: false,
    pointsLog: [],
  };
}

const CHANNEL_NAME = "family-feud-sync";

export function useGameState(role: "host" | "board" | "standalone") {
  const [state, setState] = useState<GameState>(initialState);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const { playCorrect, playStrike } = useSoundEffects();

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

  const revealAnswer = useCallback(
    (index: number) => {
      setState((prev) => {
        if (prev.revealedAnswers[index]) return prev;
        const next = { ...prev, revealedAnswers: [...prev.revealedAnswers] };
        next.revealedAnswers[index] = true;

        // Auto-award points to active team (doubled in steal mode)
        const pts = allQuestions[prev.currentQ].answers[index].points;
        const awardedPts = prev.stealMode ? pts * 2 : pts;
        const scores: [number, number] = [...prev.teamScores];
        scores[prev.activeTeam] += awardedPts;
        next.teamScores = scores;
        next.pointsLog = [
          ...prev.pointsLog,
          { team: prev.activeTeam, points: awardedPts, question: prev.currentQ },
        ];

        if (role !== "board") playCorrect();
        broadcast(next, "correct");
        return next;
      });
    },
    [playCorrect, broadcast, role]
  );

  const revealAll = useCallback(() => {
    setState((prev) => {
      const q = allQuestions[prev.currentQ];
      const newRevealed = prev.revealedAnswers.map(() => true);
      // Award unrevealed answers to active team
      const scores: [number, number] = [...prev.teamScores];
      const newLogs = [...prev.pointsLog];
      prev.revealedAnswers.forEach((wasRevealed, i) => {
        if (!wasRevealed) {
          const pts = prev.stealMode ? q.answers[i].points * 2 : q.answers[i].points;
          scores[prev.activeTeam] += pts;
          newLogs.push({ team: prev.activeTeam, points: pts, question: prev.currentQ });
        }
      });
      const next = { ...prev, revealedAnswers: newRevealed, teamScores: scores, pointsLog: newLogs };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const addStrike = useCallback(() => {
    setState((prev) => {
      if (prev.strikes >= 3) return prev;
      const newStrikes = prev.strikes + 1;

      if (newStrikes >= 3) {
        if (prev.stealMode) {
          // Steal failed — 3 strikes during steal, question is over
          // Move to next question automatically
          if (role !== "board") playStrike();
          if (prev.currentQ >= allQuestions.length - 1) {
            const next: GameState = { ...prev, strikes: 0, gameOver: true };
            broadcast(next, "strike");
            return next;
          }
          const nextQ = prev.currentQ + 1;
          const startingTeam: 0 | 1 = (nextQ % 2) as 0 | 1;
          const next: GameState = {
            ...prev,
            strikes: 0,
            currentQ: nextQ,
            revealedAnswers: new Array(allQuestions[nextQ].answers.length).fill(false),
            stealMode: false,
            activeTeam: startingTeam,
          };
          broadcast(next, "strike");
          return next;
        }

        // 3 strikes on main team — switch to steal mode, reset strikes
        const next: GameState = {
          ...prev,
          strikes: 0,
          activeTeam: prev.activeTeam === 0 ? 1 : 0,
          stealMode: true,
        };
        if (role !== "board") playStrike();
        broadcast(next, "strike");
        return next;
      }

      const next = { ...prev, strikes: newStrikes };
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

  const switchTeam = useCallback(() => {
    setState((prev) => {
      const next: GameState = {
        ...prev,
        activeTeam: prev.activeTeam === 0 ? 1 : 0,
        strikes: 0,
        stealMode: false,
      };
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
      const startingTeam: 0 | 1 = (nextQ % 2) as 0 | 1;
      const next: GameState = {
        ...prev,
        currentQ: nextQ,
        revealedAnswers: new Array(allQuestions[nextQ].answers.length).fill(false),
        strikes: 0,
        stealMode: false,
        activeTeam: startingTeam,
      };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const undoLastPoints = useCallback(() => {
    setState((prev) => {
      if (prev.pointsLog.length === 0) return prev;
      const lastEntry = prev.pointsLog[prev.pointsLog.length - 1];
      const scores: [number, number] = [...prev.teamScores];
      scores[lastEntry.team] -= lastEntry.points;
      const next = {
        ...prev,
        teamScores: scores,
        pointsLog: prev.pointsLog.slice(0, -1),
      };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const resetGame = useCallback(() => {
    const s = initialState();
    setState(s);
    broadcast(s);
  }, [broadcast]);

  const roundPoints = question.answers.reduce(
    (sum, a, i) => (state.revealedAnswers[i] ? sum + a.points : sum),
    0
  );

  return {
    ...state,
    question,
    roundPoints,
    allQuestions,
    revealAnswer,
    revealAll,
    addStrike,
    resetStrikes,
    switchTeam,
    nextQuestion,
    undoLastPoints,
    resetGame,
  };
}
