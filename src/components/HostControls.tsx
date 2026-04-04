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
  onAddScore: (team: 0 | 1, points: number) => void;
  roundPoints: number;
  isLastQuestion: boolean;
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
  onAddScore,
  roundPoints,
  isLastQuestion,
}: HostControlsProps) {
  return (
    <div className="bg-card border-t-2 border-primary/30 p-4 space-y-4">
      <h2 className="font-display text-lg text-primary uppercase tracking-widest text-center">
        Host Controls
      </h2>

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

      {/* Score awarding */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-display uppercase tracking-wider">
          Award Round Points ({roundPoints} pts)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAddScore(0, roundPoints)}
            className="font-display bg-success/80 hover:bg-success uppercase"
          >
            → Team 1
          </Button>
          <Button
            onClick={() => onAddScore(1, roundPoints)}
            className="font-display bg-success/80 hover:bg-success uppercase"
          >
            → Team 2
          </Button>
        </div>
      </div>

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
