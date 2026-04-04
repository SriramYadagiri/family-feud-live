import { useState, useCallback } from "react";
import { rounds } from "@/data/rounds";
import GameBoard from "@/components/GameBoard";
import HostControls from "@/components/HostControls";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const allQuestions = rounds.flatMap((r) => r.questions);

export default function Index() {
  const [currentQ, setCurrentQ] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(
    () => new Array(allQuestions[0].answers.length).fill(false)
  );
  const [strikes, setStrikes] = useState(0);
  const [teamScores, setTeamScores] = useState<[number, number]>([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const { playCorrect, playStrike } = useSoundEffects();

  const question = allQuestions[currentQ];

  const roundPoints = question.answers.reduce(
    (sum, a, i) => (revealedAnswers[i] ? sum + a.points : sum),
    0
  );

  const revealAnswer = useCallback(
    (index: number) => {
      setRevealedAnswers((prev) => {
        if (prev[index]) return prev;
        const next = [...prev];
        next[index] = true;
        playCorrect();
        return next;
      });
    },
    [playCorrect]
  );

  const revealAll = useCallback(() => {
    setRevealedAnswers((prev) => prev.map(() => true));
  }, []);

  const addStrike = useCallback(() => {
    setStrikes((s) => {
      if (s >= 3) return s;
      playStrike();
      return s + 1;
    });
  }, [playStrike]);

  const resetStrikes = useCallback(() => setStrikes(0), []);

  const nextQuestion = useCallback(() => {
    if (currentQ >= allQuestions.length - 1) {
      setGameOver(true);
      return;
    }
    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    setRevealedAnswers(new Array(allQuestions[nextQ].answers.length).fill(false));
    setStrikes(0);
  }, [currentQ]);

  const addScore = useCallback((team: 0 | 1, points: number) => {
    setTeamScores((prev) => {
      const next: [number, number] = [...prev];
      next[team] += points;
      return next;
    });
  }, []);

  if (gameOver) {
    const winner =
      teamScores[0] > teamScores[1]
        ? "Team 1"
        : teamScores[1] > teamScores[0]
        ? "Team 2"
        : "It's a Tie!";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary uppercase tracking-wider">
          Game Over!
        </h1>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest">Team 1</div>
            <div className="font-display text-5xl font-bold text-primary">{teamScores[0]}</div>
          </div>
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest">Team 2</div>
            <div className="font-display text-5xl font-bold text-primary">{teamScores[1]}</div>
          </div>
        </div>
        <div className="font-display text-3xl text-accent">🏆 {winner} Wins!</div>
        <button
          onClick={() => {
            setCurrentQ(0);
            setRevealedAnswers(new Array(allQuestions[0].answers.length).fill(false));
            setStrikes(0);
            setTeamScores([0, 0]);
            setGameOver(false);
          }}
          className="font-display text-xl bg-primary text-primary-foreground px-8 py-3 rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-auto">
        <GameBoard
          question={question}
          revealedAnswers={revealedAnswers}
          strikes={strikes}
          teamScores={teamScores}
          currentQuestion={currentQ}
          totalQuestions={allQuestions.length}
        />
      </div>
      <HostControls
        question={question}
        revealedAnswers={revealedAnswers}
        strikes={strikes}
        onRevealAnswer={revealAnswer}
        onRevealAll={revealAll}
        onAddStrike={addStrike}
        onResetStrikes={resetStrikes}
        onNextQuestion={nextQuestion}
        onAddScore={addScore}
        roundPoints={roundPoints}
        isLastQuestion={currentQ >= allQuestions.length - 1}
      />
    </div>
  );
}
