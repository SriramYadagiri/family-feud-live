import HostControls from "@/components/HostControls";
import { useGameState, TEAM_NAMES } from "@/hooks/useGameState";

export default function Host() {
  const game = useGameState("host");

  if (game.gameOver) {
    const isTie = game.teamScores[0] === game.teamScores[1];
    const winner = game.teamScores[0] > game.teamScores[1] ? TEAM_NAMES[0] : TEAM_NAMES[1];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="font-display text-4xl font-bold text-primary uppercase tracking-wider">
          Game Over!
        </h1>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest text-sm">{TEAM_NAMES[0]}</div>
            <div className="font-display text-4xl font-bold text-primary">{game.teamScores[0]}</div>
          </div>
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest text-sm">{TEAM_NAMES[1]}</div>
            <div className="font-display text-4xl font-bold text-primary">{game.teamScores[1]}</div>
          </div>
        </div>
        <div className="font-display text-2xl text-accent">
          {isTie ? "🤝 It's a Tie!" : `🏆 ${winner} Wins!`}
        </div>
        <button
          onClick={game.resetGame}
          className="font-display text-xl bg-primary text-primary-foreground px-8 py-3 rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-card border-b-2 border-primary/30 p-4 text-center">
        <h1 className="font-display text-xl text-primary uppercase tracking-widest">
          Punugoti's Family Feud — Host
        </h1>
        <p className="font-display text-sm text-muted-foreground mt-1">
          Open <span className="text-primary">/board</span> on the TV
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <HostControls
          question={game.question}
          revealedAnswers={game.revealedAnswers}
          strikes={game.strikes}
          onRevealAnswer={game.revealAnswer}
          onRevealAll={game.revealAll}
          onAddStrike={game.addStrike}
          onResetStrikes={game.resetStrikes}
          onNextQuestion={game.nextQuestion}
          onUndoLastPoints={game.undoLastPoints}
          onSwitchTeam={game.switchTeam}
          onRevealPlayer={game.revealPlayerAction}
          isLastQuestion={game.currentQ >= game.allQuestions.length - 1}
          activeTeam={game.activeTeam}
          stealMode={game.stealMode}
        />
      </div>
    </div>
  );
}
