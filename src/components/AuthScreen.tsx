import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { AlertCircle, Eye, EyeOff, Sparkles, LogIn, UserPlus } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(true); // Default to register mode matching the screenshot "Create Account"
  const [name, setName] = useState("");
  const [messName, setMessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Admin Area States ---
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === "1@1") {
      setAdminLoading(true);
      setAdminError(null);
      try {
        const adminEmail = "admin@mppd7x.com";
        const adminPassword = "adminMppd7xPassword123";
        
        try {
          await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        } catch (signInErr: any) {
          if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential" || signInErr.code === "auth/wrong-password") {
            try {
              const userCred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
              await updateProfile(userCred.user, {
                displayName: "Admin",
                photoURL: "MPPD7X",
              });
              await setDoc(doc(db, "messes", "MPPD7X", "settings", "current"), {
                messName: "Gausiq villa",
                fixedMealCount: 0,
              }, { merge: true });
            } catch (regErr: any) {
              console.error("Failed to register default admin:", regErr);
              throw signInErr;
            }
          } else {
            throw signInErr;
          }
        }
        
        setShowAdminPrompt(false);
        setAdminPassInput("");
        onAuthSuccess();
      } catch (err: any) {
        console.error("Admin signin failure:", err);
        setAdminError("অ্যাডমিন ভেরিফিকেশন ব্যর্থ হয়েছে: " + err.message);
      } finally {
        setAdminLoading(false);
      }
    } else {
      setAdminError("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode && !name.trim()) {
      setErrorMsg("অনুগ্রহ করে আপনার নামটি লিখুন।");
      return;
    }
    if (isRegisterMode && !messName.trim()) {
      setErrorMsg("অনুগ্রহ করে হোস্টেল বা মেসের নাম লিখুন।");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg("অনুগ্রহ করে সঠিক ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (isRegisterMode && !agreeTerms) {
      setErrorMsg("এগিয়ে যাওয়ার জন্য অনুগ্রহ করে ব্যবহারের শর্তাবলীতে সম্মতি দিন।");
      return;
    }

    try {
      setLoading(true);

      if (isRegisterMode) {
        // Generate a unique 6-character mess ID starting with M
        const generatedMessId = "M" + Math.random().toString(36).substr(2, 5).toUpperCase();

        // Create Account Mode
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCred.user, {
          displayName: name.trim(),
          photoURL: generatedMessId,
        });

        // Initialize user profile in Firestore
        try {
          await setDoc(doc(db, "users", userCred.user.uid), {
            uid: userCred.user.uid,
            email: email.trim().toLowerCase(),
            name: name.trim(),
            messId: generatedMessId
          });
        } catch (profileError) {
          console.error("Failed to write user profile:", profileError);
        }
        
        // Save user-specified messName in Firestore settings under their unique messId
        try {
          await setDoc(doc(db, "messes", generatedMessId, "settings", "current"), {
            messName: messName.trim(),
            fixedMealCount: 0,
          }, { merge: true });
        } catch (settingsError) {
          console.error("Failed to write dynamic messName:", settingsError);
        }
      } else {
        // Sign In Mode
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      onAuthSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("এই ইমেইল অ্যাড্রেসটি ইতিমধ্যে রেজিস্টার করা হয়েছে! অ্যাকাউন্টটি লগইন করুন অথবা অন্য ইমেইল ব্যবহার করুন।");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setErrorMsg("ভুল ইমেইল অথবা ভুল পাসওয়ার্ড! অনুগ্রহ করে আবার চেক করুন।");
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("প্রদানকৃত ইমেইল ফরম্যাটটি সঠিক নয়।");
      } else {
        setErrorMsg(err.message || "সংযুক্তি করা সম্ভব হয়নি। অনুগ্রহ করে পরবর্তীতে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0A16] text-[#FAF9FB] flex flex-col items-center justify-center p-3 font-sans select-none overflow-y-auto">
      {/* Container holding the form card */}
      <div className="w-full max-w-sm bg-[#130F22] border border-[#211A35] rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient effects matching the screenshot theme */}
        <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-36 h-36 bg-purple-800/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Dynamic Headings matching screenshot */}
        <div className="text-center mb-4 relative z-10">
          <div className="mb-2">
            <span className="inline-block text-[9px] uppercase tracking-widest font-semibold font-sans text-purple-400 bg-purple-950/40 border border-[#2B1F43]/80 px-2.5 py-0.5 rounded-full select-none">
              Developed by Zi Tu
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {isRegisterMode ? "Create Account" : "Sign In"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isRegisterMode ? "Start managing your mess meals" : "Access your active mess account"}
          </p>
        </div>

        {/* Elegant Error Banner */}
        {errorMsg && (
          <div className="mb-4 bg-red-950/20 border border-red-500/30 rounded-xl p-2.5 flex gap-2 items-start text-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-normal font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form Block */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegisterMode && (
            <>
              {/* Your Name */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-zinc-300 tracking-wide">Your Name</label>
                <input
                  type="text"
                  required={isRegisterMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zitu"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0D091B]/80 border border-[#251D3A] text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-sans"
                />
              </div>

              {/* Dormitory / Mess Name */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-zinc-300 tracking-wide">Dormitory / Mess Name</label>
                <input
                  type="text"
                  required={isRegisterMode}
                  value={messName}
                  onChange={(e) => setMessName(e.target.value)}
                  placeholder="e.g. Hall-1 Mess"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0D091B]/80 border border-[#251D3A] text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-sans"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-300 tracking-wide">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@email.com"
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#0D091B]/80 border border-[#251D3A] text-white placeholder-zinc-655 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-sans"
            />
          </div>

          {/* Password with Eye icon toggle */}
          <div className="space-y-1 text-left relative">
            <label className="text-xs font-semibold text-zinc-300 tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-[#0D091B]/80 border border-[#251D3A] text-white placeholder-zinc-655 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions Checkbox - Only in register mode */}
          {isRegisterMode && (
            <div className="flex items-start gap-2 mt-2 text-left">
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-[#251D3A] bg-[#0D091B] text-purple-600 focus:ring-purple-500 focus:ring-opacity-25"
              />
              <label htmlFor="agree-checkbox" className="text-[10px] text-zinc-400 select-none leading-normal">
                I agree to the <span className="text-purple-400 underline cursor-pointer hover:text-purple-300">Terms and Conditions</span>. This app is free to use with ads.
              </label>
            </div>
          )}

          {/* Submit Action Button Styled exactly like screenshot */}
          <button
            type="submit"
            disabled={
              loading ||
              (isRegisterMode
                ? !name.trim() || !messName.trim() || !email.trim() || !password.trim() || !agreeTerms
                : !email.trim() || !password.trim())
            }
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#62428F] hover:bg-[#7252A0] active:bg-[#52347D] rounded-[2rem] transition-all shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#62428F] disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 mt-3"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer switch state - Switch Mode */}
        <div className="mt-3.5 text-center">
          <p className="text-[11px] text-zinc-400">
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg(null);
              }}
              className="text-[#9879C5] hover:text-purple-300 font-semibold cursor-pointer underline hover:no-underline"
              type="button"
            >
              {isRegisterMode ? "Sign in" : "Create Account"}
            </button>
          </p>
        </div>
      </div>

      {/* Back to Home decorative button matching screenshot */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={() => {
            // Safe decorative action
          }}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-all font-semibold flex items-center gap-1 cursor-pointer bg-[#130F22]/40 px-3 py-1.5 rounded-full border border-purple-950/20 hover:scale-[1.02] duration-300"
        >
          <span>←</span> Back to Home
        </button>
      </div>

      {/* Disguised admin login trigger - color mixed to prevent regular users from spotting it easily */}
      <div 
        onClick={() => {
          setAdminPassInput("");
          setAdminError(null);
          setShowAdminPrompt(true);
        }}
        className="absolute bottom-2.5 right-3 text-[9px] text-[#130e22] hover:text-[#523e80]/20 select-none cursor-pointer transition-colors"
        title="Admin settings access point"
      >
        v1.2.0-sys
      </div>

      {/* Admin Portal Modal Dialog */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[280px] bg-[#130F22] border border-[#2B1F43] rounded-2xl p-5 shadow-2xl relative">
            <h3 className="text-xs font-semibold text-brand-amber mb-2.5 text-center">
              অ্যাডমিন পোর্টাল লগইন
            </h3>
            
            {adminError && (
              <p className="text-[10.5px] text-rose-400 mb-2.5 text-center bg-rose-950/20 py-1.5 px-2 rounded-lg border border-rose-900/30">
                {adminError}
              </p>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9.5px] uppercase font-bold tracking-wider text-zinc-400">
                  পাসওয়ার্ড লিখুন
                </label>
                <input
                  type="password"
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#0D091B] border border-[#251D3A] text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans text-center"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 justify-end text-[11px] pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPrompt(false);
                    setAdminPassInput("");
                    setAdminError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="px-4 py-1.5 rounded-lg bg-[#62428F] hover:bg-[#7252A0] text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {adminLoading ? "লগইন হচ্ছে..." : "প্রবেশ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
