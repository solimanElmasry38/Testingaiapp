import React, { useState, useEffect } from "react";
import { Question, QuizCategory } from "../types";
import { playChime } from "./AudioEngine";
import { 
  Check, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Timer, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Undo2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizActiveProps {
  category: QuizCategory;
  mode: "preset" | "ai";
  onQuit: () => void;
  onFinishQuiz: (score: number, answersLookup: Record<string, number>, timeSpent: number) => void;
}

export default function QuizActive({ category, mode, onQuit, onFinishQuiz }: QuizActiveProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersLookup, setAnswersLookup] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Time tracking
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [useTimer, setUseTimer] = useState(true);
  const [activeQuestionStartTime, setActiveQuestionStartTime] = useState<number>(Date.now());
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  const currentQuestion: Question = category.questions[currentIdx];

  // Key Bindings 1, 2, 3, 4 for answer options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          handleNextQuestion();
        }
        return;
      }
      if (["1", "2", "3", "4"].includes(e.key)) {
        const optionIdx = parseInt(e.key) - 1;
        if (optionIdx >= 0 && optionIdx < currentQuestion.options.length) {
          handleOptionClick(optionIdx);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIdx, isAnswered]);

  // Countdown timer trigger
  useEffect(() => {
    if (!useTimer || isAnswered) return;

    setTimeRemaining(25);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto answer wrong when timer clocks out
          handleOptionClick(-1); // -1 triggers instant timed out incorrect state
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIdx, isAnswered, useTimer]);

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return; // Guard double clicking

    setSelectedIdx(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Play synthesized chime
    if (soundEnabled) {
      playChime(isCorrect);
    }

    // Save user's response
    setAnswersLookup((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx
    }));

    // Add spent duration
    const duration = Math.round((Date.now() - activeQuestionStartTime) / 1000);
    setTotalElapsedTime((prev) => prev + duration);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < category.questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      setActiveQuestionStartTime(Date.now());
    } else {
      // Completed last question
      onFinishQuiz(score, answersLookup, totalElapsedTime);
    }
  };

  // UI styling references based on options clicking
  const getOptionClasses = (idx: number) => {
    const isThisSelected = selectedIdx === idx;
    const isCorrectAnswer = currentQuestion.correctIndex === idx;

    if (!isAnswered) {
      return "bg-[#020813] border-2 border-indigo-950/80 hover:border-[#0df] hover:shadow-glow-cyan hover:bg-[#071329] cursor-pointer text-slate-100 active:scale-98 font-bold";
    }

    if (isCorrectAnswer) {
      // Correct answers are highlighted in glowing green
      return "bg-emerald-950/50 border-2 border-[#39ff14] text-slate-50 shadow-glow-green font-black glow-border-green uppercase tracking-wide";
    }

    if (isThisSelected && !isCorrectAnswer) {
      // Selected incorrect answers painted red/pink
      return "bg-red-950/50 border-2 border-[#ff8ab4] text-slate-50 shadow-glow-pink font-black glow-border-pink uppercase tracking-wide";
    }

    return "bg-[#020813]/25 border-2 border-slate-900 text-slate-600 opacity-40";
  };

  const getProgressPercentage = () => {
    return ((currentIdx + 1) / category.questions.length) * 100;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="active-quiz-container">
      {/* Quiz Top Navigation Banner */}
      <div className="flex items-center justify-between bg-[#050D1D] border-2 border-indigo-950/80 p-4 rounded-2xl relative overflow-hidden shadow-md">
        <button 
          onClick={onQuit}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:border-[#ff8ab4] transition-all py-2 px-4 bg-slate-950/80 border border-indigo-950 rounded-xl cursor-pointer font-black uppercase tracking-wider hover:shadow-glow-pink"
        >
          <Undo2 className="w-3.5 h-3.5" /> Stop Review
        </button>

        <div className="flex items-center gap-2">
          {mode === "ai" && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 border border-[#0df] bg-cyan-950/20 text-[#0df] rounded-full tracking-wider uppercase animate-pulse shadow-glow-cyan glow-text-cyan">
              <Sparkles className="w-3 h-3 text-[#0df]" /> Custom AI
            </span>
          )}
          <span className="text-xs font-black text-slate-300 px-3 py-1.5 bg-slate-950 rounded-xl border border-indigo-950 uppercase tracking-widest">
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sounds toggle button */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            className="p-2.5 bg-slate-950 border border-indigo-950 text-slate-450 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0df] glow-text-cyan" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Time control toggle */}
          <button
            onClick={() => setUseTimer(!useTimer)}
            title={useTimer ? "Disable countdown" : "Enable countdown"}
            className={`p-2.5 border rounded-lg transition-all flex items-center gap-1 text-xs cursor-pointer ${
              useTimer ? "bg-slate-955 border-[#ff8ab4] text-[#ff8ab4] shadow-glow-pink glow-text-pink" : "bg-slate-955 border-slate-900 text-slate-500"
            }`}
          >
            <Timer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Stat Header */}
      <div className="bg-[#050D1D] border-2 border-indigo-950/80 rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-widest">
          <span className="text-slate-400">
            Progress <strong className="text-white font-black text-sm">{currentIdx + 1}</strong> / <strong className="text-slate-300">{category.questions.length}</strong>
          </span>
          <span className="text-slate-400">
            Score: <strong className="text-[#39ff14] font-black text-sm glow-text-green">{score}</strong>
          </span>
        </div>

        {/* Dynamic Progress Slide Bar with glowing line */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-indigo-950/80 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ type: "spring", stiffness: 60 }}
            className="h-full bg-gradient-to-r from-[#ff8ab4] via-magenta-550 to-[#0df] rounded-full shadow-glow-cyan"
          />
        </div>

        {/* Timer Banner, shown inside question */}
        {useTimer && !isAnswered && (
          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-indigo-950 shadow-inner">
            <span className="text-[10px] text-slate-400 font-black font-mono flex items-center gap-1.5 uppercase tracking-widest">
              <Timer className="w-3.5 h-3.5 text-amber-500 animate-spin" /> Time remaining:
            </span>
            <div className="flex items-center gap-2">
              {/* Dynamic progress bar of timer */}
              <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-950">
                <div 
                  className={`h-full rounded-full ${timeRemaining <= 5 ? 'bg-[#ff8ab4] animate-pulse shadow-glow-pink' : 'bg-amber-400'}`}
                  style={{ width: `${(timeRemaining / 25) * 100}%`, transition: 'width 1s linear' }}
                />
              </div>
              <span className={`font-mono text-xs font-black uppercase tracking-widest ${timeRemaining <= 5 ? 'text-[#ff8ab4] glow-text-pink animate-bounce' : 'text-amber-400'}`}>
                {timeRemaining} SEC
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Question Card Box */}
      <div className="bg-[#050D1D] border-2 border-indigo-950/85 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Neon decorative background glows */}
        <div className="absolute top-[-20%] right-[-15%] w-80 h-80 bg-gradient-to-b from-[#0df]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-15%] w-80 h-80 bg-gradient-to-b from-[#ff8ab4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-[#0df]/45 text-[#0df] shadow-glow-cyan self-start animate-bounce">
              <HelpCircle className="w-5 h-5 text-[#0df]" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Multiple options grid */}
          <div className="grid grid-cols-1 gap-4 pt-2" id="quiz-options-set">
            {currentQuestion.options.map((option, idx) => {
              const isChosen = selectedIdx === idx;
              const isCorrectAnswer = currentQuestion.correctIndex === idx;

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between text-sm md:text-base group font-bold relative overflow-hidden ${getOptionClasses(idx)}`}
                >
                  <div className="flex items-center gap-4 z-10">
                    {/* Index Indicator Pill A, B, C, D */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono border-2 transition-all font-black ${
                      !isAnswered 
                        ? "bg-slate-950 border-indigo-950/90 text-slate-400 group-hover:border-[#0df] group-hover:text-[#0df] group-hover:shadow-glow-cyan" 
                        : isCorrectAnswer 
                          ? "bg-emerald-950/85 border-[#39ff14] text-[#39ff14] shadow-glow-green"
                          : isChosen
                            ? "bg-red-950/85 border-[#ff8ab4] text-[#ff8ab4] shadow-glow-pink"
                            : "bg-slate-950 border-slate-900 text-slate-650"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-extrabold">{option}</span>
                  </div>

                  {/* Icon overrides after answer has locked */}
                  <div className="flex items-center gap-2 z-10">
                    {/* Shortcut indicator tags when unanswered */}
                    {!isAnswered && (
                      <span className="text-[9px] font-mono font-black text-slate-500 border border-slate-900 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                        KEY {idx + 1}
                      </span>
                    )}

                    {isAnswered && isCorrectAnswer && (
                      <div className="p-1.5 bg-emerald-500/10 rounded-full border-2 border-[#39ff14] shadow-glow-green">
                        <Check className="w-3.5 h-3.5 text-[#39ff14]" />
                      </div>
                    )}
                    {isAnswered && isChosen && !isCorrectAnswer && (
                      <div className="p-1.5 bg-red-500/10 rounded-full border-2 border-[#ff8ab4] shadow-glow-pink">
                        <X className="w-3.5 h-3.5 text-[#ff8ab4]" />
                      </div>
                    )}
                  </div>

                  {/* Subtle inner background ambient light for selected and correct items */}
                  {isAnswered && isCorrectAnswer && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14]/5 to-transparent pointer-events-none" />
                  )}
                  {isAnswered && isChosen && !isCorrectAnswer && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff8ab4]/5 to-transparent pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation panel area ("if it false highlight correct one if it true explain it") */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 border-t border-indigo-950/80 pt-6 space-y-4"
              >
                <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                  selectedIdx === currentQuestion.correctIndex
                    ? "bg-[#39ff14]/5 border-[#39ff14]/40 text-slate-100 shadow-glow-green"
                    : "bg-[#ff8ab4]/5 border-[#ff8ab4]/40 text-slate-100 shadow-glow-pink"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg border-2 ${
                      selectedIdx === currentQuestion.correctIndex 
                        ? "bg-emerald-950 text-[#39ff14] border-[#39ff14]/40" 
                        : "bg-red-950 text-[#ff8ab4] border-[#ff8ab4]/40"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      selectedIdx === currentQuestion.correctIndex ? 'text-[#39ff14] glow-text-green' : 'text-[#ff8ab4] glow-text-pink'
                    }`}>
                      Scientific Core Insight Details
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#ff8ab4] via-magenta-550 to-pink-600 hover:scale-[1.02] text-slate-950 text-xs font-black uppercase tracking-widest transition-all shadow-glow-pink hover:shadow-glow-pink active:scale-97 cursor-pointer"
                  >
                    {currentIdx + 1 === category.questions.length ? "Decrypt Final Results" : "Next Inquiry"}{" "}
                    <ChevronRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
