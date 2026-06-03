import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import QuizActive from "./components/QuizActive";
import QuizSummary from "./components/QuizSummary";
import AuthPage from "./components/AuthPage";
import { QuizCategory } from "./types";
import { GraduationCap, BrainCircuit, Lightbulb, LogOut, UserCheck, ShieldAlert } from "lucide-react";

type QuizView = "auth" | "dashboard" | "active" | "summary";

export default function App() {
  const [currentView, setCurrentView] = useState<QuizView>("auth");
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [playMode, setPlayMode] = useState<"preset" | "ai">("preset");
  
  // User Profile States
  const [userProfile, setUserProfile] = useState<{
    username: string;
    avatar: string;
    title: string;
  } | null>(null);

  // Results Trackers
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, number>>({});
  const [sessionTimeSpent, setSessionTimeSpent] = useState(0);

  // On initial mount, load credentials
  useEffect(() => {
    const savedUser = localStorage.getItem("quiz_auth_username");
    const savedAvatar = localStorage.getItem("quiz_auth_avatar");
    const savedTitle = localStorage.getItem("quiz_auth_title");

    if (savedUser && savedAvatar) {
      setUserProfile({
        username: savedUser,
        avatar: savedAvatar || "🌌",
        title: savedTitle || "Novice Scholar"
      });
      setCurrentView("dashboard");
    } else {
      setCurrentView("auth");
    }
  }, []);

  const handleAuthSuccess = (username: string, avatar: string, title: string) => {
    setUserProfile({ username, avatar, title });
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out? Your lifetime high scores will be preserved in this browser.")) {
      localStorage.removeItem("quiz_auth_username");
      localStorage.removeItem("quiz_auth_avatar");
      localStorage.removeItem("quiz_auth_title");
      setUserProfile(null);
      setCurrentView("auth");
    }
  };

  const handleSelectCategory = (category: QuizCategory, mode: "preset" | "ai") => {
    setSelectedCategory(category);
    setPlayMode(mode);
    setCurrentView("active");
  };

  const handleFinishQuiz = (score: number, answers: Record<string, number>, timeSpent: number) => {
    setSessionScore(score);
    setSessionAnswers(answers);
    setSessionTimeSpent(timeSpent);
    setCurrentView("summary");
  };

  const handleRestartQuiz = () => {
    if (selectedCategory) {
      setCurrentView("active");
    }
  };

  const handleGoHome = () => {
    setSelectedCategory(null);
    if (userProfile) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("auth");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-white antialiased selection:text-pink-100">
      {/* Universal Sticky Header Segment */}
      <header className="sticky top-0 z-55 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-4 flex items-center justify-between">
        <div 
          onClick={handleGoHome} 
          className="flex items-center gap-2.5 cursor-pointer group hover:opacity-95"
        >
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-950/40 text-white flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm md:text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Interactive Study Quiz
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider font-mono">
              v1.2.0 • Powered by Gemini
            </span>
          </div>
        </div>

        {/* Global Action shortcuts or Info badge */}
        <div className="flex items-center gap-4">
          {userProfile ? (
            <div className="flex items-center gap-3 bg-[#050D1D] border border-indigo-950 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-sm" title={userProfile.title}>{userProfile.avatar}</span>
              <div className="text-left hidden sm:block">
                <span className="font-extrabold text-white block text-[11px] leading-tight">
                  {userProfile.username}
                </span>
                <span className="text-[9px] font-semibold text-pink-300 uppercase block tracking-wider mt-0.5">
                  {userProfile.title}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="De-matriculate / Sign Out"
                className="p-1 px-1.5 bg-slate-950 border border-slate-900 rounded-lg hover:text-red-400 text-slate-400 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Click choices or tap keys [1-4]</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Study Arena Body Canvas */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {currentView === "auth" && (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}

        {currentView === "dashboard" && (
          <Dashboard onSelectCategory={handleSelectCategory} />
        )}

        {currentView === "active" && selectedCategory && (
          <QuizActive 
            category={selectedCategory} 
            mode={playMode}
            onQuit={handleGoHome}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {currentView === "summary" && selectedCategory && (
          <QuizSummary
            category={selectedCategory}
            score={sessionScore}
            answers={sessionAnswers}
            timeSpentSeconds={sessionTimeSpent}
            onRestart={handleRestartQuiz}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Footnote branding segment */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 mt-12 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} Interactive Cosmic Study Hub. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-slate-500 font-medium font-sans">
            <span className="text-pink-300">Glow Pastel Pink Mode</span>
            <span>•</span>
            <span className="text-cyan-400">Cyber Cyan Tech</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
