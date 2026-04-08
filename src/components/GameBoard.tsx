import { Question } from "@/data/rounds";
import { TEAM_NAMES } from "@/hooks/useGameState";
import teamVamshiImg from "@/assets/team-vamshi.jpg";
import teamVishniImg from "@/assets/team-vishni.jpg";
import player1Img from "@/assets/player-1.png";
import player2Img from "@/assets/player-2.png";

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

const teamImages = [teamVamshiImg, teamVishniImg];

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
    <div className="flex min-h-screen">
      {/* Player 1 - Left side */}
      <div className="hidden lg:flex w-48 flex-shrink-0 items-end justify-center overflow-hidden">
        <img src={player1Img} alt="Player 1" className="h-[80vh] w-auto object-contain object-bottom" />
      </div>

      <div className="flex flex-col items-center gap-6 p-6 flex-1 min-w-0">
      {/* Title */}
      <h2 className="font-display text-xl md:text-2xl text-primary uppercase tracking-widest">
        Punugoti's Family Feud
      </h2>

      {/* Scoreboard */}
      <div className="flex w-full max-w-4xl justify-between items-center">
        <TeamScore name={TEAM_NAMES[0]} score={teamScores[0]} active={activeTeam === 0} image={teamImages[0]} />
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
        <TeamScore name={TEAM_NAMES[1]} score={teamScores[1]} active={activeTeam === 1} image={teamImages[1]} />
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

function TeamScore({ name, score, active, image }: { name: string; score: number; active: boolean; image: string }) {
  return (
    <div
      className={`rounded-xl px-6 py-3 text-center min-w-[140px] transition-all duration-300 ${
        active
          ? "bg-primary/20 border-2 border-primary shadow-lg shadow-primary/20 scale-105"
          : "bg-card border-2 border-primary/30"
      }`}
    >
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover mx-auto mb-1 border-2 border-primary/40" />
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
