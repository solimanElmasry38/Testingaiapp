import React, { useEffect, useState } from "react";
import { QuizCategory } from "../types";
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Flame, 
  Clock, 
  Check, 
  X, 
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "motion/react";

interface QuizSummaryProps {
  category: QuizCategory;
  score: number;
  answers: Record<string, number>;
  timeSpentSeconds: number;
  onRestart: () => void;
  onGoHome: () => void;
}

export default function QuizSummary({ 
  category, 
  score, 
  answers, 
  timeSpentSeconds, 
  onRestart, 
  onGoHome 
}: QuizSummaryProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isStreakUnlocked, setIsStreakUnlocked] = useState(false);

  const percentCorrect = Math.round((score / category.questions.length) * 100);
  const gainedXP = score * 50 + (score === category.questions.length ? 150 : 0); // 50 XP per correct, 150 bonus for perfect score

  useEffect(() => {
    // 1. Completed Quizzes Stats Incrementer
    const currentCompleted = Number(localStorage.getItem("quiz_completed_count") || "0");
    const nextCompleted = currentCompleted + 1;
    localStorage.setItem("quiz_completed_count", nextCompleted.toString());

    // 2. Average Score Updater
    const currentAvg = Number(localStorage.getItem("quiz_avg_score") || "0");
    const nextAvg = Math.round(((currentAvg * currentCompleted) + percentCorrect) / nextCompleted);
    localStorage.setItem("quiz_avg_score", nextAvg.toString());

    // 3. XP points increments
    const currentXP = Number(localStorage.getItem("quiz_points") || "0");
    localStorage.setItem("quiz_points", (currentXP + gainedXP).toString());

    // 4. Record high scores lookup
    const highScoresRaw = localStorage.getItem("quiz_high_scores") || "{}";
    const parsedHighScores = JSON.parse(highScoresRaw);
    const existingHighScore = parsedHighScores[category.id] || 0;
    if (score > existingHighScore) {
      parsedHighScores[category.id] = score;
      localStorage.setItem("quiz_high_scores", JSON.stringify(parsedHighScores));
    }

    // 5. Daily Streak Calculator
    const streakCount = Number(localStorage.getItem("quiz_current_streak") || "0");
    const lastActiveDateStr = localStorage.getItem("quiz_last_active_date");
    const todayStr = new Date().toDateString();

    if (lastActiveDateStr !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let nextStreak = 1;
      if (lastActiveDateStr === yesterdayStr) {
        nextStreak = streakCount + 1;
        setIsStreakUnlocked(true);
      }
      localStorage.setItem("quiz_current_streak", nextStreak.toString());
      localStorage.setItem("quiz_last_active_date", todayStr);
    }
  }, [category.id, score, percentCorrect, gainedXP]);

  const toggleExpand = (qId: string) => {
    if (expandedQuestionId === qId) {
      setExpandedQuestionId(null);
    } else {
      setExpandedQuestionId(qId);
    }
  };

  // Human-friendly performance greeting
  const getFeedbackHeader = () => {
    if (score === category.questions.length) return { title: "Perfect Cosmic Mastery!", subtitle: "Flawless effort. You scored a full marks reward!", color: "text-[#39ff14] glow-text-green" };
    if (score >= category.questions.length * 0.7) return { title: "Exceeded Excellence!", subtitle: "Fabulous comprehension. You possess solid grasp over the topics.", color: "text-[#0df] glow-text-cyan" };
    return { title: "Knowledge Builder!", subtitle: "Every attempt makes you smarter. Review custom insights below to level up.", color: "text-[#ff8ab4] glow-text-pink" };
  };

  const feedback = getFeedbackHeader();

  return (
    <div className="max-w-3xl mx-auto space-y-8" id="quiz-summary-panel">
      {/* Visual Report Card Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[#050D1D] border-2 border-indigo-950/80 p-8 md:p-12 text-center space-y-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ff8ab4] via-magenta-550 to-[#0df] shadow-glow-cyan" />
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-gradient-to-b from-[#0df]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 bg-gradient-to-b from-[#ff8ab4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center p-5 bg-slate-950 rounded-full border-2 border-[#0df]/80 shadow-glow-cyan relative mt-2 animate-bounce">
          {score === category.questions.length ? (
            <Award className="w-14 h-14 text-[#39ff14] glow-text-green" />
          ) : (
            <Trophy className="w-14 h-14 text-[#ff8ab4] glow-text-pink" />
          )}
        </div>

        <div className="space-y-3">
          <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${feedback.color}`}>
            {feedback.title}
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto font-medium">
            {feedback.subtitle}
          </p>
        </div>

        {/* Dynamic Metric Badges Row with strong neon border glows */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-4" id="stats-unlocked-grid">
          <div className="bg-[#020813] border-2 border-indigo-950/80 rounded-xl p-4 hover:border-[#0df] hover:shadow-glow-cyan transition-all duration-300">
            <span className="text-[9px] text-[#0df] uppercase tracking-widest font-black block glow-text-cyan">Your Score</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono">
              {score} / {category.questions.length}
            </span>
          </div>

          <div className="bg-[#020813] border-2 border-indigo-950/80 rounded-xl p-4 hover:border-[#ff8ab4] hover:shadow-glow-pink transition-all duration-300">
            <span className="text-[9px] text-[#ff8ab4] uppercase tracking-widest font-black block glow-text-pink">Success Rate</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono">
              {percentCorrect}%
            </span>
          </div>

          <div className="bg-[#020813] border-2 border-indigo-950/80 rounded-xl p-4 hover:border-[#39ff14] hover:shadow-glow-green transition-all duration-300 animate-pulse">
            <span className="text-[9px] text-[#39ff14] uppercase tracking-widest font-black block glow-text-green">XP Unlocked</span>
            <span className="text-2xl font-black text-[#39ff14] mt-1 block font-mono glow-text-green">
              +{gainedXP} XP
            </span>
          </div>

          <div className="bg-[#020813] border-2 border-indigo-950/80 rounded-xl p-4 hover:border-magenta-500 hover:shadow-glow-magenta transition-all duration-300">
            <span className="text-[9px] text-magenta-400 uppercase tracking-widest font-black block glow-text-magenta">Time Taken</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-magenta-450 glow-text-magenta animate-spin" /> {timeSpentSeconds}S
            </span>
          </div>
        </div>

        {/* Next Step Control Actions */}
        <div className="flex flex-col sm:flex-row gap-4 py-2 items-center justify-center pt-4">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#ff8ab4]/50 bg-slate-950 hover:bg-slate-900 text-[#ff8ab4] rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-glow-pink active:scale-97 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#ff8ab4]" /> Review Again
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 via-magenta-550 to-pink-600 hover:scale-[1.01] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-glow-pink active:scale-97 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Go Back to Dashboard
          </button>
        </div>
      </div>

      {/* Answer Insights Diagnostic Review Section */}
      <div className="space-y-4" id="diagnostic-review-area">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0df] glow-text-cyan" /> 
          <span className="glow-text-cyan font-black text-slate-100 uppercase tracking-wider">Diagnostic Answers Breakdown</span>
        </h2>

        <div className="space-y-4">
          {category.questions.map((q, qIdx) => {
            const userPickIdx = answers[q.id];
            const wasTimedOut = userPickIdx === -1 || userPickIdx === undefined;
            const isCorrect = userPickIdx === q.correctIndex;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div 
                key={q.id}
                className={`bg-[#050D1D] border-2 rounded-2xl overflow-hidden transition-all text-slate-100 duration-300 ${
                  isCorrect 
                    ? "border-emerald-950 hover:border-[#39ff14]/30" 
                    : "border-red-950 hover:border-[#ff8ab4]/30"
                }`}
              >
                {/* Header Collapsible Trigger bar */}
                <div 
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-950/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl border-2 mt-0.5 flex-shrink-0 ${
                      isCorrect 
                        ? "bg-emerald-950 text-[#39ff14] border-[#39ff14]/40 shadow-glow-green" 
                        : "bg-red-950/60 text-[#ff8ab4] border-[#ff8ab4]/40 shadow-glow-pink"
                    }`}>
                      {isCorrect ? <Check className="w-4.5 h-4.5" /> : <X className="w-4.5 h-4.5" />}
                    </div>

                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest block ${
                        isCorrect ? "text-[#39ff14] glow-text-green" : "text-[#ff8ab4] glow-text-pink"
                      }`}>
                        Question {qIdx + 1} • {isCorrect ? "DECRYPTED" : "CORRUPTED"}
                      </span>
                      <p className="text-base font-extrabold text-white mt-1.5 leading-relaxed pr-4">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Collapsible Content detail block */}
                {isExpanded && (
                  <div className="border-t border-indigo-950/80 p-5 bg-[#020813] space-y-4">
                    {/* Itemized list of question options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isOriginalCorrect = optIdx === q.correctIndex;
                        const isPickedByMe = optIdx === userPickIdx;

                        let optionBorder = "border-2 border-indigo-950/70 bg-slate-950/50 text-slate-400 font-bold";
                        if (isOriginalCorrect) {
                          // Correct highlight
                          optionBorder = "border-2 border-[#39ff14]/50 bg-emerald-950/30 text-[#39ff14] font-black shadow-glow-green";
                        } else if (isPickedByMe) {
                          // Mismatched selection
                          optionBorder = "border-2 border-[#ff8ab4]/50 bg-red-950/30 text-[#ff8ab4] font-black shadow-glow-pink";
                        }

                        return (
                          <div 
                            key={optIdx}
                            className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${optionBorder}`}
                          >
                            <span className="font-mono text-[9px] font-black py-0.5 px-2 rounded bg-slate-950 border-2 border-indigo-950 text-slate-300">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 font-extrabold">{opt}</span>
                            {isOriginalCorrect && <Check className="w-4 h-4 text-[#39ff14] glow-text-green" />}
                            {isPickedByMe && !isOriginalCorrect && <X className="w-4 h-4 text-[#ff8ab4] glow-text-pink" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Scientific Insight Card */}
                    <div className="p-4 bg-indigo-950/20 rounded-xl border-2 border-indigo-950 space-y-2">
                      <span className="text-[10px] font-black text-[#0df] uppercase tracking-widest block glow-text-cyan">
                        Scientific Core Insight & Explanation
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
