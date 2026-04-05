import { Question } from "@/data/rounds";
import { Button } from "@/components/ui/button";

interface HostControlsProps {
  question: Question;
  revealedAnswers: boolean[];
  strikes: number;
  onRevealAnswer: (index: number) => void;
  onRevealAll: () => void;
  onAddStrike: () => void;
  onResetStrikes: () => void;
  onNextQuestion: () => void;
  onUndoLastPoints: () => void;
  onSwitchTeam: () => void;
  isLastQuestion: boolean;
  activeTeam: 0 | 1;
  stealMode: boolean;
}

export default function HostControls({
  question,
  revealedAnswers,
  strikes,
  onRevealAnswer,
  onRevealAll,
  onAddStrike,
  onResetStrikes,
  onNextQuestion,
  onUndoLastPoints,
  onSwitchTeam,
  isLastQuestion,
  activeTeam,
  stealMode,
}: HostControlsProps) {
  const activeTeamName = activeTeam === 0 ? "Team 1" : "Team 2";

  return (
    <div className="bg-card border-t-2 border-primary/30 p-4 space-y-4">
      <h2 className="font-display text-lg text-primary uppercase tracking-widest text-center">
        Host Controls
      </h2>

      {/* Active team indicator */}
      <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg p-3">
        <div className="font-display text-sm uppercase tracking-wider">
          <span className="text-muted-foreground">Playing: </span>
          <span className="text-primary font-bold">{activeTeamName}</span>
          {stealMode && (
            <span className="text-destructive ml-2 animate-pulse font-bold">(STEAL × 2 PTS)</span>
          )}
        </div>
        <Button onClick={onSwitchTeam} variant="outline" size="sm" className="font-display text-xs uppercase">
          Switch Team
        </Button>
      </div>

      {/* Auto-scoring info */}
      <div className="text-xs text-muted-foreground text-center font-display uppercase tracking-wider">
        Points auto-awarded to {activeTeamName}
        {stealMode ? " (doubled)" : ""}
      </div>

      {/* Reveal answers */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-display uppercase tracking-wider">
          Reveal Answers
        </p>
        <div className="grid grid-cols-2 gap-2">
          {question.answers.map((answer, i) => (
            <Button
              key={i}
              variant={revealedAnswers[i] ? "secondary" : "default"}
              disabled={revealedAnswers[i]}
              onClick={() => onRevealAnswer(i)}
              className="font-display text-sm uppercase tracking-wide"
            >
              {i + 1}. {answer.text} ({answer.points})
            </Button>
          ))}
        </div>
        <Button onClick={onRevealAll} variant="outline" className="w-full font-display uppercase tracking-wider">
          Reveal All
        </Button>
      </div>

      {/* Strikes */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground font-display uppercase tracking-wider">
          Strikes: {strikes}/3
        </p>
        <Button
          onClick={onAddStrike}
          disabled={strikes >= 3}
          variant="destructive"
          size="sm"
          className="font-display"
        >
          Add Strike ✕
        </Button>
        <Button onClick={onResetStrikes} variant="outline" size="sm" className="font-display">
          Reset
        </Button>
      </div>

      {/* Undo points */}
      <Button
        onClick={onUndoLastPoints}
        variant="outline"
        size="sm"
        className="w-full font-display uppercase tracking-wider text-destructive border-destructive/30"
      >
        Undo Last Points
      </Button>

      {/* Navigation */}
      <Button
        onClick={onNextQuestion}
        variant="outline"
        className="w-full font-display text-lg uppercase tracking-wider border-primary/50"
      >
        {isLastQuestion ? "Game Over 🎉" : "Next Question →"}
      </Button>
    </div>
  );
}
