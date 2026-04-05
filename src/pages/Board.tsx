import GameBoard from "@/components/GameBoard";
import { useGameState, TEAM_NAMES } from "@/hooks/useGameState";

export default function Board() {
  const game = useGameState("board");

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
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
  );
}
