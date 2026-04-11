import { useState, useCallback, useEffect, useRef } from "react";
import { rounds } from "@/data/rounds";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const allQuestions = rounds.flatMap((r) => r.questions);

export const TEAM_NAMES = ["Mr. V", "Mrs. V"] as const;

export interface GameState {
  currentQ: number;
  revealedAnswers: boolean[];
  strikes: number;
  teamScores: [number, number];
  gameOver: boolean;
  activeTeam: 0 | 1;
  stealMode: boolean;
  roundPointsOriginalTeam: number;
  originalTeam: 0 | 1;
  stealTeamGuessed: boolean;
  pointsLog: { team: 0 | 1; points: number; question: number }[];
  revealPlayer: 0 | 1 | null;
  revealedPlayers: [boolean, boolean];
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
    roundPointsOriginalTeam: 0,
    originalTeam: 0,
    stealTeamGuessed: false,
    pointsLog: [],
    revealPlayer: null,
    revealedPlayers: [false, false],
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

        const pts = allQuestions[prev.currentQ].answers[index].points;
        const scores: [number, number] = [...prev.teamScores];

        if (prev.stealMode) {
          // Stealing team guessed correctly
          if (!prev.stealTeamGuessed) {
            // First correct guess during steal — steal all original team's round points
            scores[prev.originalTeam] -= prev.roundPointsOriginalTeam;
            scores[prev.activeTeam] += prev.roundPointsOriginalTeam;
            next.stealTeamGuessed = true;
            next.pointsLog = [
              ...prev.pointsLog,
              { team: prev.originalTeam, points: -prev.roundPointsOriginalTeam, question: prev.currentQ },
              { team: prev.activeTeam, points: prev.roundPointsOriginalTeam, question: prev.currentQ },
            ];
          } else {
            next.pointsLog = [...prev.pointsLog];
          }
          // Award the guessed answer's points to stealing team
          scores[prev.activeTeam] += pts;
          next.pointsLog.push({ team: prev.activeTeam, points: pts, question: prev.currentQ });
        } else {
          // Normal play — award to active team and track round points
          scores[prev.activeTeam] += pts;
          next.roundPointsOriginalTeam = prev.roundPointsOriginalTeam + pts;
          next.pointsLog = [
            ...prev.pointsLog,
            { team: prev.activeTeam, points: pts, question: prev.currentQ },
          ];
        }

        next.teamScores = scores;

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
      const scores: [number, number] = [...prev.teamScores];
      const newLogs = [...prev.pointsLog];
      let roundPts = prev.roundPointsOriginalTeam;
      let stealGuessed = prev.stealTeamGuessed;

      prev.revealedAnswers.forEach((wasRevealed, i) => {
        if (!wasRevealed) {
          const pts = q.answers[i].points;
          if (prev.stealMode) {
            if (!stealGuessed) {
              // First guess during steal — steal original team's points
              scores[prev.originalTeam] -= roundPts;
              scores[prev.activeTeam] += roundPts;
              newLogs.push({ team: prev.originalTeam, points: -roundPts, question: prev.currentQ });
              newLogs.push({ team: prev.activeTeam, points: roundPts, question: prev.currentQ });
              stealGuessed = true;
            }
            scores[prev.activeTeam] += pts;
            newLogs.push({ team: prev.activeTeam, points: pts, question: prev.currentQ });
          } else {
            scores[prev.activeTeam] += pts;
            roundPts += pts;
            newLogs.push({ team: prev.activeTeam, points: pts, question: prev.currentQ });
          }
        }
      });

      const next = {
        ...prev,
        revealedAnswers: newRevealed,
        teamScores: scores,
        pointsLog: newLogs,
        roundPointsOriginalTeam: roundPts,
        stealTeamGuessed: stealGuessed,
      };
      broadcast(next);
      return next;
    });
  }, [broadcast]);

  const addStrike = useCallback(() => {
    setState((prev) => {
      if (prev.strikes >= 3) return prev;
      const newStrikes = prev.strikes + 1;

      // First, always show the strike (including the 3rd)
      const next = { ...prev, strikes: newStrikes };
      if (role !== "board") playStrike();
      broadcast(next, "strike");

      // If this is the 3rd strike, schedule the transition after a delay
      if (newStrikes >= 3) {
        setTimeout(() => {
          setState((cur) => {
            if (cur.strikes !== 3) return cur; // already handled

            if (cur.stealMode) {
              // Steal failed — move to next question
              if (cur.currentQ >= allQuestions.length - 1) {
                const s: GameState = { ...cur, strikes: 0, gameOver: true };
                broadcast(s);
                return s;
              }
              const nextQ = cur.currentQ + 1;
              const startingTeam: 0 | 1 = (nextQ % 2) as 0 | 1;
              const s: GameState = {
                ...cur,
                strikes: 0,
                currentQ: nextQ,
                revealedAnswers: new Array(allQuestions[nextQ].answers.length).fill(false),
                stealMode: false,
                activeTeam: startingTeam,
                originalTeam: startingTeam,
                roundPointsOriginalTeam: 0,
                stealTeamGuessed: false,
              };
              broadcast(s);
              return s;
            }

            // Switch to steal mode
            const s: GameState = {
              ...cur,
              strikes: 0,
              activeTeam: cur.activeTeam === 0 ? 1 : 0,
              stealMode: true,
            };
            broadcast(s);
            return s;
          });
        }, 1500);
      }

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
        originalTeam: startingTeam,
        roundPointsOriginalTeam: 0,
        stealTeamGuessed: false,
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

  const revealPlayerAction = useCallback(
    (team: 0 | 1) => {
      setState((prev) => {
        const newRevealed: [boolean, boolean] = [...prev.revealedPlayers];
        newRevealed[team] = true;
        const next = { ...prev, revealPlayer: team, revealedPlayers: newRevealed };
        broadcast(next);
        return next;
      });
    },
    [broadcast]
  );

  const clearReveal = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, revealPlayer: null };
      broadcast(next);
      return next;
    });
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
    revealPlayerAction,
    clearReveal,
  };
}
