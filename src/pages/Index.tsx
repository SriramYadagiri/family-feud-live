import { useGameState, TEAM_NAMES } from "@/hooks/useGameState";
import GameBoard from "@/components/GameBoard";
import HostControls from "@/components/HostControls";
import { Link } from "react-router-dom";

export default function Index() {
  const game = useGameState("standalone");

  if (game.gameOver) {
    const isTie = game.teamScores[0] === game.teamScores[1];
    const winner = game.teamScores[0] > game.teamScores[1] ? TEAM_NAMES[0] : TEAM_NAMES[1];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary uppercase tracking-wider">
          Game Over!
        </h1>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest">{TEAM_NAMES[0]}</div>
            <div className="font-display text-5xl font-bold text-primary">{game.teamScores[0]}</div>
          </div>
          <div className="text-center">
            <div className="font-display text-muted-foreground uppercase tracking-widest">{TEAM_NAMES[1]}</div>
            <div className="font-display text-5xl font-bold text-primary">{game.teamScores[1]}</div>
          </div>
        </div>
        <div className="font-display text-3xl text-accent">
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
      <div className="bg-card/50 border-b border-primary/20 px-4 py-2 text-center">
        <p className="font-display text-xs text-muted-foreground uppercase tracking-wider">
          💡 For live games: open{" "}
          <Link to="/board" className="text-primary underline">/board</Link> on the TV and{" "}
          <Link to="/host" className="text-primary underline">/host</Link> on your phone
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <GameBoard
          question={game.question}
          revealedAnswers={game.revealedAnswers}
          strikes={game.strikes}
          teamScores={game.teamScores}
          currentQuestion={game.currentQ}
          totalQuestions={game.allQuestions.length}
          activeTeam={game.activeTeam}
          stealMode={game.stealMode}
        />
      </div>
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
        isLastQuestion={game.currentQ >= game.allQuestions.length - 1}
        activeTeam={game.activeTeam}
        stealMode={game.stealMode}
      />
    </div>
  );
}
