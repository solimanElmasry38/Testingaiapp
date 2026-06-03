import React, { useState } from "react";
import { 
  KeyRound, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  HelpCircle,
  Hash,
  Binary,
  GraduationCap,
  Sparkle,
  MonitorCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthProps {
  onAuthSuccess: (username: string, avatar: string, title: string) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [studentTitle, setStudentTitle] = useState("Novice Scholar");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("🌌");
  const [isKeypadLocked, setIsKeypadLocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Dynamic input values for keyboard visual feedback
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Pastel colored avatar options
  const AVATARS = [
    { emoji: "🌌", label: "Cosmist" },
    { emoji: "🔬", label: "Alchemist" },
    { emoji: "🧝‍♀️", label: "Legend" },
    { emoji: "👩‍🚀", label: "Astronaut" },
    { emoji: "🧬", label: "Genetics" },
    { emoji: "🤖", label: "Cybernetist" },
  ];

  const TITLES = [
    "Novice Scholar",
    "Astrophysical Cadet",
    "Cyber Defense Initiate",
    "Full-Stack Seeker",
    "Quantum Theoretician"
  ];

  // Interactivity check systems
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isMinLength = password.length >= 6;
  const passwordStrength = Math.min(
    (password.length > 0 ? 1 : 0) + 
    (password.length >= 6 ? 1 : 0) + 
    (password.length >= 10 ? 1 : 0) + 
    (hasSymbol ? 1 : 0),
    4
  );

  const handleKeypadPress = (num: string) => {
    if (passcode.length < 4) {
      const nextPass = passcode + num;
      setPasscode(nextPass);
      // Simulate click sound or visual chime
      setActiveKey(num);
      setTimeout(() => setActiveKey(null), 150);
    }
  };

  const handleKeypadClear = () => {
    setPasscode("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!username.trim()) {
      setAuthError("Scientific Callsign/Username cannot be empty.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Passkey must be at least 6 characters.");
      return;
    }

    // Handshake complete, register/login user
    localStorage.setItem("quiz_auth_username", username.trim());
    localStorage.setItem("quiz_auth_avatar", selectedAvatar);
    localStorage.setItem("quiz_auth_title", studentTitle);
    
    // Give bonus points for enrolling
    const points = Number(localStorage.getItem("quiz_points") || "0");
    if (points === 0) {
      localStorage.setItem("quiz_points", "200"); // 200 welcome XP!
    }

    onAuthSuccess(username.trim(), selectedAvatar, studentTitle);
  };

  const handleQuickDemoPlay = () => {
    // Generate automatic cadet details
    const randomCallsign = "Cadet_" + Math.floor(Math.random() * 900 + 100);
    const title = "Astrophysical Cadet";
    const avatar = "👩‍🚀";
    
    localStorage.setItem("quiz_auth_username", randomCallsign);
    localStorage.setItem("quiz_auth_avatar", avatar);
    localStorage.setItem("quiz_auth_title", title);
    
    onAuthSuccess(randomCallsign, avatar, title);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6 min-h-[80vh]" id="auth-view-parent">
      
      {/* Narrative Left Segment block */}
      <div className="md:col-span-5 space-y-6 md:pr-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400 bg-cyan-950/40 text-[11px] font-sans font-extrabold tracking-widest text-[#0df] uppercase animate-pulse shadow-glow-cyan">
          <Sparkle className="w-3.5 h-3.5 text-[#0df] animate-spin" /> Secure Matriculation Gateway
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
          Establish Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8ab4] via-magenta-500 to-[#0df] filter drop-shadow-[0_0_15px_rgba(255,138,180,0.6)] glow-text-pink">
            Cosmic Identity
          </span>
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          Log in or register your cadet profile. Unlock permanent XP tracking, streak badges, custom study configurations, and deep-educational telemetry diagnostics.
        </p>

        {/* Dynamic decorative checklist with neon labels */}
        <div className="space-y-4 pt-2 text-slate-200 text-xs font-bold">
          <div className="flex items-center gap-3 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/40 hover:border-pink-500/30 transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#ff8ab4] shadow-glow-pink flex-shrink-0" />
            <span className="glow-text-pink">Navy Space Academy Terminal Design</span>
          </div>
          <div className="flex items-center gap-3 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/40 hover:border-cyan-500/30 transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#0df] shadow-glow-cyan flex-shrink-0" />
            <span className="glow-text-cyan">Interactive Cyber Neon Credentials Guard</span>
          </div>
          <div className="flex items-center gap-3 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/40 hover:border-green-500/30 transition-colors">
            <div className="w-3 h-3 rounded-full bg-[#39ff14] shadow-glow-green flex-shrink-0" />
            <span className="glow-text-green">Digital Passcode Secondary Verification Panel</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900">
          <button 
            onClick={handleQuickDemoPlay}
            className="text-xs text-cyan-300 hover:text-white transition-all bg-gradient-to-r from-slate-900 to-[#050D1D] hover:from-[#0df]/20 hover:to-indigo-950 border border-[#0df]/40 hover:border-[#0df] rounded-xl px-5 py-3 font-extrabold shadow-md hover:shadow-glow-cyan active:scale-95"
          >
            Demo-Bypass Matriculation <span className="font-mono text-[#0df]">→</span>
          </button>
        </div>
      </div>

      {/* Cyber Auth Card right block */}
      <div className="md:col-span-7 bg-[#061126] border-2 border-[#0df]/30 hover:border-pink-500/30 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 relative overflow-hidden" id="login-terminal-console">
        {/* Neon decorative background glows */}
        <div className="absolute top-[-20%] right-[-15%] w-80 h-80 bg-gradient-to-b from-[#ff8ab4]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-15%] w-80 h-80 bg-gradient-to-b from-[#0df]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-60 h-60 bg-gradient-to-b from-magenta-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Segment Toggles */}
        <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-xl border border-indigo-950/80 mb-7">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setAuthError(null); }}
            className={`py-3 text-xs font-black rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
              isLogin 
                ? "bg-[#091833] text-white border border-[#ff8ab4]/50 shadow-glow-pink glow-text-pink" 
                : "text-slate-400 hover:text-[#ff8ab4]"
            }`}
          >
            Sign-In Port
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setAuthError(null); }}
            className={`py-3 text-xs font-black rounded-lg transition-all cursor-pointer uppercase tracking-wider ${
              !isLogin 
                ? "bg-[#091833] text-white border border-[#0df]/50 shadow-glow-cyan glow-text-cyan" 
                : "text-slate-400 hover:text-[#0df]"
            }`}
          >
            New Cadet Register
          </button>
        </div>

        {/* Main interactive form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Input 1: Callsign */}
            <div className="space-y-2">
              <label htmlFor="username-callsign" className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#ff8ab4]">
                <span className="glow-text-pink">Cadet Callsign</span>
                <span className="text-[#39ff14] glow-text-green font-mono">📡 Active Link</span>
              </label>
              <div className="relative">
                <input
                  id="username-callsign"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  required
                  placeholder="e.g. CaptainCosmo, DrNewton..."
                  className="w-full bg-[#020813] text-white border border-indigo-950 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#ff8ab4] transition-all focus:shadow-glow-pink placeholder:text-slate-650"
                />
                <User className="w-4 h-4 text-[#ff8ab4] absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Input 2: Pasword */}
            <div className="space-y-2">
              <label htmlFor="passkey-token" className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#0df]">
                <span className="glow-text-cyan">Security Passkey</span>
                <span className="text-magenta-450 glow-text-magenta">Min 6 characters</span>
              </label>
              <div className="relative">
                <input
                  id="passkey-token"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#020813] text-white border border-indigo-950 rounded-xl pl-10 pr-11 py-3.5 text-sm focus:outline-none focus:border-[#0df] transition-all focus:shadow-glow-cyan placeholder:text-slate-650"
                />
                <KeyRound className="w-4 h-4 text-[#0df] absolute left-3.5 top-4" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-slate-450 hover:text-[#0df] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Password visual strength meter */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold">
                    <span>Passkey Cryptography Level</span>
                    <span className={
                      passwordStrength <= 1 ? "text-red-500" :
                      passwordStrength <= 2 ? "text-[#ff8ab4] glow-text-pink" :
                      passwordStrength === 3 ? "text-[#0df] glow-text-cyan" : "text-[#39ff14] glow-text-green"
                    }>
                      {passwordStrength === 1 && "Weak Link"}
                      {passwordStrength === 2 && "Standard Decryption Key"}
                      {passwordStrength === 3 && "Vibrant Multi-Frequency Guard"}
                      {passwordStrength === 4 && "Quantum Neon Entangled"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-2 bg-slate-950 rounded-full p-0.5 border border-indigo-950">
                    <div className={`h-full rounded-full transition-all ${passwordStrength >= 1 ? "bg-[#ff8ab4] shadow-glow-pink" : "bg-transparent"}`} />
                    <div className={`h-full rounded-full transition-all ${passwordStrength >= 2 ? "bg-magenta-500/90 shadow-glow-magenta" : "bg-transparent"}`} />
                    <div className={`h-full rounded-full transition-all ${passwordStrength >= 3 ? "bg-[#0df] shadow-glow-cyan" : "bg-transparent"}`} />
                    <div className={`h-full rounded-full transition-all ${passwordStrength >= 4 ? "bg-[#39ff14] shadow-glow-green" : "bg-transparent"}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Custom registration components */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-1"
              >
                {/* Academic Title Select */}
                <div className="space-y-2">
                  <label htmlFor="title-level" className="text-[11px] font-black text-[#ff8ab4] uppercase tracking-widest block glow-text-pink">
                    Choose Cadet Honorific Title
                  </label>
                  <select
                    id="title-level"
                    value={studentTitle}
                    onChange={(e) => setStudentTitle(e.target.value)}
                    className="w-full bg-[#020813] text-slate-200 border border-indigo-950 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff8ab4] focus:shadow-glow-pink"
                  >
                    {TITLES.map((tit, idx) => (
                      <option key={idx} value={tit} className="bg-slate-950 text-slate-200">
                        {tit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Avatar Grid Selector */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-[#0df] uppercase tracking-widest block glow-text-cyan">
                    Select Identity Sigil
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(av.emoji)}
                        title={av.label}
                        className={`text-xl p-3 bg-slate-950 rounded-xl border transition-all hover:scale-110 cursor-pointer ${
                          selectedAvatar === av.emoji 
                            ? "border-[#39ff14] bg-indigo-950/50 shadow-glow-green" 
                            : "border-indigo-950 hover:border-[#ff8ab4]/40"
                        }`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Verification Code keypad secondary panel */}
          <div className="border-t border-indigo-950/80 pt-6 space-y-4">
            <div className="flex justify-between items-center text-[11px] font-black text-slate-350 uppercase tracking-widest">
              <span className="text-slate-400">Security Passcode Verification (Optional pin)</span>
              <span className={passcode.length === 4 ? "text-[#39ff14] glow-text-green" : "text-[#ff8ab4] glow-text-pink"}>
                {passcode.length} / 4 Registered
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Output dots */}
              <div className="col-span-4 bg-slate-950 border border-indigo-950 rounded-xl p-3 h-12 flex items-center justify-center gap-1.5 shadow-inner">
                {[1, 2, 3, 4].map((dot) => (
                  <div
                    key={dot}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      passcode.length >= dot 
                        ? "bg-[#39ff14] shadow-glow-green" 
                        : "bg-slate-900 border border-indigo-950"
                    }`}
                  />
                ))}
              </div>

              {/* Numeric keypad matrix */}
              <div className="col-span-8 grid grid-cols-4 gap-1.5" id="virtual-pin-matrix">
                {["1", "2", "3", "4", "5", "6", "7", "8"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(num)}
                    className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      activeKey === num
                        ? "bg-[#39ff14]/15 border-[#39ff14] text-[#39ff14] scale-95 shadow-glow-green"
                        : "bg-slate-950 border-indigo-950 text-slate-300 hover:text-[#0df] hover:border-[#0df]/50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="col-span-4 py-2 text-[10px] font-black rounded-lg bg-slate-950 border border-indigo-950/80 text-[#ff8ab4] hover:text-[#ff8ab4]/80 hover:border-[#ff8ab4]/40 hover:shadow-glow-pink uppercase tracking-widest cursor-pointer"
                >
                  Reset security pin
                </button>
              </div>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/20 text-xs text-red-300 rounded-xl leading-relaxed font-semibold">
              <span className="font-black flex items-center gap-1.5 mb-0.5">⚠️ Entry Denied:</span>
              {authError}
            </div>
          )}

          {/* Form Action submission button with vibrant magenta gradients and pastel glows */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#ff8ab4] via-magenta-650 to-[#0df] hover:scale-[1.01] text-slate-950 rounded-xl text-xs uppercase tracking-widest font-black transition-all shadow-glow-pink active:scale-98 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>
              {isLogin ? "Decrypt System & Enter Terminal" : "Store Credentials & Initialize Cadet Profile"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
