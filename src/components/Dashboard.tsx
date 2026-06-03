import React, { useState, useEffect } from "react";
import { QuizCategory } from "../types";
import { PRESET_CATEGORIES } from "../presets";
import { 
  Code, 
  Globe, 
  Atom, 
  Sparkles, 
  Flame, 
  Trophy, 
  BookOpen, 
  Search, 
  Loader2, 
  ArrowRight,
  BrainCircuit,
  HelpCircle,
  HelpCircleIcon
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onSelectCategory: (category: QuizCategory, mode: "preset" | "ai") => void;
}

export default function Dashboard({ onSelectCategory }: DashboardProps) {
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Stats Hook
  const [stats, setStats] = useState({
    completedCount: 0,
    averageScore: 0,
    streak: 0,
    points: 0,
    highScores: {} as Record<string, number>,
  });

  useEffect(() => {
    const loadedCount = Number(localStorage.getItem("quiz_completed_count") || "0");
    const loadedAvg = Number(localStorage.getItem("quiz_avg_score") || "0");
    const loadedStreak = Number(localStorage.getItem("quiz_current_streak") || "0");
    const loadedPoints = Number(localStorage.getItem("quiz_points") || "0");
    const loadedHighScores = JSON.parse(localStorage.getItem("quiz_high_scores") || "{}");

    setStats({
      completedCount: loadedCount,
      averageScore: loadedAvg,
      streak: loadedStreak,
      points: loadedPoints,
      highScores: loadedHighScores,
    });
  }, []);

  // Quick suggestion list for the AI custom model
  const SUGGESTIONS = [
    "Greek & Roman Mythology",
    "Beethoven & Classical Music",
    "Cybersecurity Basics",
    "Oceanography & Deep Sea Life",
    "Theoretical Quantum Physics"
  ];

  // Request the custom quiz from our newly crafted backend API
  const handleGenerateAIQuiz = async (topicStr: string) => {
    if (!topicStr.trim()) return;
    setIsGenerating(true);
    setGenError(null);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicStr.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate quality AI quiz. Verify GEMINI_API_KEY is active.");
      }

      // Convert generated JSON object into QuizCategory structure
      const aiCategory: QuizCategory = {
        id: `ai-quiz-${Date.now()}`,
        name: data.quiz.name || `Topic: ${topicStr}`,
        description: data.quiz.description || `A customized study review for ${topicStr}.`,
        iconName: "Sparkles",
        color: "violet",
        questions: data.quiz.questions,
      };

      onSelectCategory(aiCategory, "ai");
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || "Network error. Please try generating again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Maps icon names to their respective Lucide React icon components
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5 text-indigo-400" />;
      case "Globe": return <Globe className="w-5 h-5 text-amber-400" />;
      case "Atom": return <Atom className="w-5 h-5 text-teal-400" />;
      default: return <Sparkles className="w-5 h-5 text-violet-400" />;
    }
  };

  // Reset Lifetime statistics
  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset your study history, scores, and current streak? This action is permanent.")) {
      localStorage.removeItem("quiz_completed_count");
      localStorage.removeItem("quiz_avg_score");
      localStorage.removeItem("quiz_current_streak");
      localStorage.removeItem("quiz_points");
      localStorage.removeItem("quiz_high_scores");
      setStats({
        completedCount: 0,
        averageScore: 0,
        streak: 0,
        points: 0,
        highScores: {},
      });
    }
  };

  return (
    <div className="space-y-10" id="quiz-dashboard-parent">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#0df] bg-cyan-950/20 text-xs font-extrabold text-[#0df] backdrop-blur-md uppercase tracking-wider animate-pulse shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5" /> Next-generation Quiz Experience
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
            Elevate Your Knowledge with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8ab4] via-magenta-400 to-[#0df] filter drop-shadow-[0_0_12px_rgba(255,138,180,0.5)] glow-text-pink">
              Interactive Learning
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
            Choose from science and technology presets crafted with rich explanations, or harness Gemini power to generate any customized quiz topic instantly.
          </p>
        </div>
      </div>

      {/* Metrics Banner with Glowing Text & Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-tracker">
        <div className="bg-[#050D1D] border-2 border-indigo-950/80 rounded-2xl p-5 hover:border-[#0df] transition-all flex items-center justify-between shadow-md hover:shadow-glow-cyan group duration-300">
          <div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider group-hover:text-white transition-colors">Quizzes Completed</span>
            <h3 className="text-3xl font-black text-white mt-1 bg-gradient-to-r from-sky-400 to-[#0df] bg-clip-text text-transparent glow-text-cyan">{stats.completedCount}</h3>
          </div>
          <div className="p-3 bg-cyan-950/40 rounded-xl border border-[#0df]/40 shadow-glow-cyan animate-pulse">
            <BookOpen className="w-5 h-5 text-[#0df]" />
          </div>
        </div>

        <div className="bg-[#050D1D] border-2 border-indigo-950/80 rounded-2xl p-5 hover:border-pink-500/60 transition-all flex items-center justify-between shadow-md hover:shadow-glow-pink group duration-300">
          <div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider group-hover:text-white transition-colors">Average Success</span>
            <h3 className="text-3xl font-black text-white mt-1 bg-gradient-to-r from-pink-400 to-[#ff8ab4] bg-clip-text text-transparent glow-text-pink">
              {stats.completedCount > 0 ? `${stats.averageScore}%` : "0%"}
            </h3>
          </div>
          <div className="p-3 bg-pink-955/40 rounded-xl border border-pink-400/40 shadow-glow-pink animate-pulse">
            <Trophy className="w-5 h-5 text-[#ff8ab4]" />
          </div>
        </div>

        <div className="bg-[#050D1D] border-2 border-indigo-950/80 rounded-2xl p-5 hover:border-magenta-550 transition-all flex items-center justify-between shadow-md hover:shadow-glow-magenta group duration-300">
          <div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider group-hover:text-white transition-colors">Daily Streak</span>
            <h3 className="text-3xl font-black text-white mt-1 flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-magenta-500 bg-clip-text text-transparent glow-text-magenta">
              {stats.streak} <span className="text-xs uppercase font-black text-slate-400 tracking-widest mt-1">days</span>
            </h3>
          </div>
          <div className="p-3 bg-magenta-950/40 rounded-xl border border-magenta-500/40 shadow-glow-magenta">
            <Flame className="w-5 h-5 text-magenta-400 animate-bounce" />
          </div>
        </div>

        <div className="bg-[#050D1D] border-2 border-indigo-950/80 rounded-2xl p-5 hover:border-[#39ff14] transition-all flex items-center justify-between shadow-md hover:shadow-glow-green group duration-300">
          <div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider group-hover:text-white transition-colors">Total XP Points</span>
            <h3 className="text-3xl font-black text-white mt-1 bg-gradient-to-r from-[#39ff14] to-emerald-400 bg-clip-text text-transparent glow-text-green">{stats.points}</h3>
          </div>
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-[#39ff14]/40 shadow-glow-green animate-pulse">
            <span className="text-[#39ff14] font-black text-sm font-mono glow-text-green">+XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Study Preset Category List */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#ff8ab4] glow-text-pink" /> 
              <span className="glow-text-pink font-black text-slate-100 uppercase tracking-wider">Curated Academy Presets</span>
            </h2>
            {stats.completedCount > 0 && (
              <button 
                onClick={handleResetStats}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors font-bold uppercase tracking-wider bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-900"
              >
                Reset Stats
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PRESET_CATEGORIES.map((cat) => {
              const borderStyles = 
                cat.color === "indigo" ? "hover:border-[#0df] hover:shadow-glow-cyan group" :
                cat.color === "amber" ? "hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] group" :
                "hover:border-[#39ff14] hover:shadow-glow-green group";

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat, "preset")}
                  className={`cursor-pointer bg-[#050D1D] border-2 border-indigo-950/85 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${borderStyles}`}
                >
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex gap-4">
                      <div className="p-3 bg-slate-950 border border-indigo-950/90 rounded-xl">
                        {renderCategoryIcon(cat.iconName)}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white group-hover:text-[#0df] transition-all uppercase tracking-wide">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                          {cat.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900">
                            {cat.questions.length} Questions
                          </span>
                          {stats.highScores[cat.id] !== undefined && (
                            <span className="text-[11px] font-black text-amber-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-md border border-amber-500/20 shadow-sm animate-pulse">
                              <Trophy className="w-3.5 h-3.5 text-amber-400" /> TOP SCORE: {stats.highScores[cat.id]}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-2 px-3.5 rounded-xl bg-slate-950 border border-indigo-950 hover:border-[#0df] self-center opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs text-[#0df] font-black uppercase tracking-wider shadow-glow-cyan animate-pulse">
                      LAUCH <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic AI Custom Quiz Generator */}
        <div className="lg:col-span-5 space-y-5">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#0df] glow-text-cyan" /> 
            <span className="glow-text-cyan font-black text-slate-100 uppercase tracking-wider">AI Custom Topic Review</span>
          </h2>

          <div className="bg-[#050D1D] border-2 border-[#0df]/20 hover:border-[#ff8ab4]/30 transition-all duration-500 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-[#ff8ab4]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-gradient-to-b from-[#0df]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Provide any specialty scientific, history, or programming topic. Gemini will craft a high-quality 5-question test with customized choices and scientific explanations.
              </p>
            </div>

            <div className="space-y-4">
              <label htmlFor="topic-input" className="text-[11px] font-black text-[#ff8ab4] uppercase tracking-widest block glow-text-pink">
                Your Custom Topic Focus
              </label>
              <div className="relative">
                <input
                  id="topic-input"
                  type="text"
                  placeholder="e.g. Theoretical Quantum Mechanics, Beethoven, Python..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-[#020813] text-white border border-indigo-950 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#ff8ab4] transition-all focus:shadow-glow-pink placeholder:text-slate-600 disabled:opacity-50"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
              </div>

              {genError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-300 leading-relaxed font-semibold">
                  <span className="font-extrabold block mb-0.5 uppercase tracking-wide text-red-400">⚠️ Quiz Generation Alert:</span>
                  {genError}
                </div>
              )}

              <button
                disabled={isGenerating || !customTopic.trim()}
                onClick={() => handleGenerateAIQuiz(customTopic)}
                className="w-full flex items-center justify-center gap-2 py-4 border border-[#ff8ab4]/50 bg-gradient-to-r from-pink-500 via-magenta-550 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-slate-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-glow-pink hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" /> Constructing Quantum Test...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" /> Synthesize Custom Quiz
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-indigo-950/80">
              <span className="text-[11px] font-black text-[#0df] block uppercase tracking-widest mb-3 glow-text-cyan">
                Quick-Initiate Fields
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    disabled={isGenerating}
                    onClick={() => {
                      setCustomTopic(sug);
                      handleGenerateAIQuiz(sug);
                    }}
                    className="text-[11px] bg-slate-950 hover:bg-indigo-950/30 border border-indigo-950 hover:border-[#ff8ab4] text-slate-200 px-3 py-2 rounded-full transition-all active:scale-95 disabled:opacity-50 font-bold tracking-wide cursor-pointer hover:shadow-inner"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
