import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  Sun,
  Moon,
  Calendar,
  Sparkles,
  Edit2,
  X,
  ChevronDown,
  CalendarDays,
  History,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  messName: string;
  messId: string;
  currentMonth: string;
  onMonthChange: (month: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onUpdateMessName: (newName: string) => void;
  isSyncing?: boolean;
  lastCloudSync?: string | null;
  onShowHistory: () => void;
  onOpenMenu: () => void;
}

// Highly stylized mapping for months with Bengali values, short codes, and individual gradient theme styles
const MONTH_DETAILS = [
  { id: "January 2026", enShort: "JAN", bnFull: "জানুয়ারি", bnShort: "জানু" },
  {
    id: "February 2026",
    enShort: "FEB",
    bnFull: "ফেব্রুয়ারি",
    bnShort: "ফেব্রু",
  },
  { id: "March 2026", enShort: "MAR", bnFull: "মার্চ", bnShort: "মার্চ" },
  { id: "April 2026", enShort: "APR", bnFull: "এপ্রিল", bnShort: "এপ্রিল" },
  { id: "May 2026", enShort: "MAY", bnFull: "মে", bnShort: "মে" },
  { id: "June 2026", enShort: "JUN", bnFull: "জুন", bnShort: "জুন" },
  { id: "July 2026", enShort: "JUL", bnFull: "জুলাই", bnShort: "জুলাই" },
  { id: "August 2026", enShort: "AUG", bnFull: "আগস্ট", bnShort: "আগস্ট" },
  {
    id: "September 2026",
    enShort: "SEP",
    bnFull: "সেপ্টেম্বর",
    bnShort: "সেপ্টে",
  },
  { id: "October 2026", enShort: "OCT", bnFull: "অক্টোবর", bnShort: "অক্টো" },
  { id: "November 2026", enShort: "NOV", bnFull: "নভেম্বর", bnShort: "নভে" },
  { id: "December 2026", enShort: "DEC", bnFull: "ডিসেম্বর", bnShort: "ডিসে" },
];

export default function Header({
  messName,
  messId,
  currentMonth,
  onMonthChange,
  darkMode,
  setDarkMode,
  onUpdateMessName,
  isSyncing,
  lastCloudSync,
  onShowHistory,
  onOpenMenu,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(messName);

  // Custom calendar selector states
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentMonthDetail =
    MONTH_DETAILS.find((m) => m.id === currentMonth) || MONTH_DETAILS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(messId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && tempName.trim() !== messName) {
      onUpdateMessName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <header className="w-full select-none">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-950/40 bg-brand-card/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-brand-amber hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="flex items-center gap-1.5 py-0.5"
              >
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-brand-amber font-sans text-sm font-bold tracking-tight rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-accent w-40"
                  autoFocus
                  maxLength={100}
                  required
                />
                <button
                  type="submit"
                  className="p-1 text-emerald-500 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                  title="সংরক্ষণ করুন"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-rose-500 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                  title="বাতিল করুন"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-brand-amber font-sans tracking-tight">
                  {messName}
                </span>
                <button
                  onClick={() => {
                    setTempName(messName);
                    setIsEditing(true);
                  }}
                  className="p-1 text-zinc-400 hover:text-brand-amber transition-colors cursor-pointer"
                  title="মেসের নাম পরিবর্তন করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent font-semibold border border-brand-accent/20 flex items-center gap-1.5 shadow-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shadow-sm" />
                  {currentMonthDetail.bnFull}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5 mt-0.5">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                <span>ID: {messId}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-brand-amber transition-colors cursor-pointer"
                  title="Copy Mess ID"
                  id="btn-copy-mess-id"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Real-time Google Cloud Sync Tracking State Indicators */}
              {isSyncing ? (
                <div className="text-[9.5px] text-amber-400 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                  <span>ক্লাউড ব্যাকআপ হচ্ছে...</span>
                </div>
              ) : lastCloudSync ? (
                <div className="text-[9.5px] text-emerald-400 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>ব্যাকআপ নিরাপদ আছে ({lastCloudSync})</span>
                </div>
              ) : (
                <div className="text-[9.5px] text-emerald-500/80 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 inline-block" />
                  <span>ক্লাউডে সেভড</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Custom Trendy Calendar Month Picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] ${
                isPickerOpen
                  ? "border-brand-accent text-brand-amber bg-zinc-850"
                  : "border-zinc-800 hover:border-zinc-700 text-zinc-200"
              }`}
              style={{ minWidth: "125px" }}
              id="select-month-picker"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span className="flex-1 text-left truncate font-sans">
                {currentMonthDetail.bnFull}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform duration-300 ${isPickerOpen ? "rotate-180 text-brand-accent" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-[310px] bg-brand-card border border-purple-950/80 rounded-2xl p-3.5 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.85),_0_0_15px_rgba(168,85,247,0.15)] z-50 overflow-hidden"
                >
                  {/* Glowing header accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent via-brand-amber to-brand-accent" />

                  <div className="flex items-center justify-between mb-2.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-brand-amber" />
                      <h4 className="text-xs font-bold font-sans text-brand-amber">
                        সেশন মাস নির্বাচন করুন
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                      ২০২৬
                    </span>
                  </div>

                  {/* 3x4 layout for Months */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {MONTH_DETAILS.map((month) => {
                      const isSelected = month.id === currentMonth;
                      return (
                        <button
                          key={month.id}
                          onClick={() => {
                            onMonthChange(month.id);
                            setIsPickerOpen(false);
                          }}
                          className={`relative group flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer text-center overflow-hidden active:scale-95 ${
                            isSelected
                              ? "bg-gradient-to-br from-brand-accent to-purple-600 text-white font-medium shadow-[0_4px_12px_rgba(168,85,247,0.3)] border-brand-accent"
                              : "bg-zinc-950/60 border-zinc-900 text-zinc-300 hover:text-white hover:border-brand-accent/30 hover:bg-zinc-900"
                          }`}
                        >
                          {/* Visual hover color splash */}
                          {!isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/5 duration-300" />
                          )}

                          <span
                            className={`text-[8px] font-mono tracking-wider font-semibold uppercase mb-0.5 ${
                              isSelected
                                ? "text-purple-200"
                                : "text-brand-accent/50 group-hover:text-brand-accent"
                            }`}
                          >
                            {month.enShort}
                          </span>

                          <span
                            className={`text-xs font-bold font-sans ${
                              isSelected
                                ? "text-white"
                                : "text-zinc-250 group-hover:text-brand-amber transition-colors"
                            }`}
                          >
                            {month.bnShort}
                          </span>

                          {isSelected && (
                            <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer hint */}
                  <div className="mt-3 pt-2.5 border-t border-purple-950/20 text-center flex items-center justify-center gap-1 text-[9px] text-zinc-405">
                    <Sparkles className="w-2.5 h-2.5 text-brand-amber" />
                    <span className="text-zinc-400">
                      নতুন মাস সিলেক্ট করলে ঐ মাসের রিপোর্ট লোড হবে
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History Button */}
          <button
            onClick={onShowHistory}
            className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            title="৩ মাসের হিস্টোরি ও পিডিএফ"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-brand-amber transition-all cursor-pointer"
            id="btn-theme-toggle"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
