import { Question } from "@/data/rounds";

interface GameBoardProps {
  question: Question;
  revealedAnswers: boolean[];
  strikes: number;
  teamScores: [number, number];
  currentQuestion: number;
  totalQuestions: number;
  activeTeam: 0 | 1;
  stealMode?: boolean;
}

export default function GameBoard({
  question,
  revealedAnswers,
  strikes,
  teamScores,
  currentQuestion,
  totalQuestions,
  activeTeam,
  stealMode,
}: GameBoardProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen">
      {/* Scoreboard */}
      <div className="flex w-full max-w-4xl justify-between items-center">
        <TeamScore name="Team 1" score={teamScores[0]} active={activeTeam === 0} />
        <div className="flex flex-col items-center">
          <div className="font-display text-muted-foreground text-lg tracking-wider">
            Q{currentQuestion + 1}/{totalQuestions}
          </div>
          {stealMode && (
            <div className="font-display text-xs text-destructive uppercase tracking-widest animate-pulse mt-1">
              Steal Attempt!
            </div>
          )}
        </div>
        <TeamScore name="Team 2" score={teamScores[1]} active={activeTeam === 1} />
      </div>

      {/* Question */}
      <div className="w-full max-w-4xl bg-card border-2 border-primary/40 rounded-xl p-6 text-center shadow-lg shadow-primary/10">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-primary tracking-wide uppercase leading-tight">
          {question.question}
        </h1>
      </div>

      {/* Answer Board */}
      <div className="w-full max-w-4xl grid gap-3">
        {question.answers.map((answer, i) => (
          <div key={i} className="answer-panel h-16 md:h-20">
            <div className={`answer-panel-inner ${revealedAnswers[i] ? "revealed" : ""}`}>
              <div className="answer-front">
                <span className="font-display text-3xl md:text-5xl font-bold text-primary/60">
                  {i + 1}
                </span>
              </div>
              <div className="answer-back px-4 flex justify-between items-center">
                <span className="font-display text-xl md:text-3xl font-bold text-answer-foreground uppercase tracking-wide">
                  {answer.text}
                </span>
                <span className="font-display text-2xl md:text-4xl font-bold text-primary">
                  {answer.points}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strikes */}
      {strikes > 0 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="flex gap-6">
            {Array.from({ length: strikes }).map((_, i) => (
              <span key={i} className="strike-x text-8xl md:text-[12rem]">
                ✕
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeamScore({ name, score, active }: { name: string; score: number; active: boolean }) {
  return (
    <div
      className={`rounded-xl px-6 py-3 text-center min-w-[140px] transition-all duration-300 ${
        active
          ? "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/20 scale-105"
          : "bg-card border-2 border-primary/30"
      }`}
    >
      <div className="font-display text-sm text-muted-foreground uppercase tracking-widest">
        {name}
      </div>
      <div className="font-display text-3xl md:text-5xl font-bold text-primary">
        {score}
      </div>
      {active && (
        <div className="font-display text-[10px] text-primary uppercase tracking-widest mt-1">
          Playing
        </div>
      )}
    </div>
  );
}
