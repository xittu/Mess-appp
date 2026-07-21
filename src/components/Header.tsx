import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Moon,
  Sun,
  Globe,
  Bell,
  History,
  Check,
  Copy,
  ChevronDown,
  Edit2,
  X,
  Calendar,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageType } from "../i18n/translations";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onOpenMenu: () => void;
  onShowHistory: () => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  messName: string;
  onUpdateMessName: (name: string) => void;
  messId: string;
  lastCloudSync?: string | null;
  isSyncing?: boolean;
  currentMonth: string;
  onMonthChange: (monthId: string) => void;
}

const MONTH_DETAILS = [
  { id: "01", enShort: "Jan", enFull: "January" },
  { id: "02", enShort: "Feb", enFull: "February" },
  { id: "03", enShort: "Mar", enFull: "March" },
  { id: "04", enShort: "Apr", enFull: "April" },
  { id: "05", enShort: "May", enFull: "May" },
  { id: "06", enShort: "Jun", enFull: "June" },
  { id: "07", enShort: "Jul", enFull: "July" },
  { id: "08", enShort: "Aug", enFull: "August" },
  { id: "09", enShort: "Sep", enFull: "September" },
  { id: "10", enShort: "Oct", enFull: "October" },
  { id: "11", enShort: "Nov", enFull: "November" },
  { id: "12", enShort: "Dec", enFull: "December" },
];

export default function Header({
  onOpenMenu,
  onShowHistory,
  darkMode,
  setDarkMode,
  messName,
  onUpdateMessName,
  messId,
  lastCloudSync,
  isSyncing,
  currentMonth,
  onMonthChange,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(messName);
  const langRef = useRef<HTMLDivElement>(null);

  // Month Picker State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMonthDetail =
    MONTH_DETAILS.find((m) => m.id === currentMonth) || MONTH_DETAILS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(messId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && tempName !== messName) {
      onUpdateMessName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <header className="w-full select-none">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-purple-950/40 bg-white dark:bg-brand-card/95 shadow-sm dark:shadow-none backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMenu}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-brand-amber hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
                  className="bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-brand-amber font-sans text-sm font-bold tracking-tight rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-accent w-32 sm:w-40"
                  autoFocus
                  maxLength={100}
                  required
                />
                <button
                  type="submit"
                  className="p-1 text-emerald-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                  title={t("header.save")}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                  title={t("header.cancel")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold text-brand-amber font-sans tracking-tight max-w-[90px] sm:max-w-none truncate">
                  {messName}
                </span>
                <button
                  onClick={() => {
                    setTempName(messName);
                    setIsEditing(true);
                  }}
                  className="p-1 text-slate-600 dark:text-zinc-400 hover:text-brand-amber transition-colors cursor-pointer"
                  title={t("header.changeName")}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                
                {/* Custom Trendy Calendar Month Picker */}
                <div className="relative" ref={pickerRef}>
                  <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 text-[11px] font-semibold rounded-full border bg-slate-50 dark:bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] ${
                      isPickerOpen
                        ? "border-brand-accent text-brand-amber bg-slate-100 dark:bg-zinc-850"
                        : "border-brand-accent/20 hover:border-slate-300 dark:hover:border-zinc-700 text-brand-accent bg-brand-accent/5"
                    }`}
                    id="select-month-picker"
                  >
                    <Calendar className="w-3 h-3 shrink-0 hidden sm:block" />
                    <span className="truncate font-sans">
                      {currentMonthDetail.enFull}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 shrink-0 transition-transform duration-300 ${isPickerOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed top-[60px] left-1/2 -translate-x-1/2 sm:absolute sm:top-full sm:left-0 sm:-translate-x-0 mt-2 w-[92vw] sm:w-[310px] max-w-[340px] bg-white dark:bg-brand-card shadow-xl dark:shadow-none border border-slate-200 dark:border-purple-950/80 rounded-2xl p-3.5 sm:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.85),_0_0_15px_rgba(168,85,247,0.15)] z-50 overflow-hidden"
                      >
                        {/* Glowing header accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent via-brand-amber to-brand-accent" />
                        <div className="flex items-center justify-between mb-2.5 pt-1">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-brand-amber" />
                            <h4 className="text-xs font-bold font-sans text-brand-amber">
                              {t("header.selectSession")}
                            </h4>
                          </div>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                            {t("header.year26")}
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
                                    ? "bg-gradient-to-br from-brand-accent to-purple-600 text-slate-900 dark:text-white font-medium shadow-[0_4px_12px_rgba(168,85,247,0.3)] border-brand-accent"
                                    : "bg-slate-100 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-white hover:border-brand-accent/30 hover:bg-slate-50 dark:hover:bg-zinc-900"
                                }`}
                              >
                                {/* Visual hover color splash */}
                                {!isSelected && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/5 duration-300" />
                                )}
                                <span
                                  className={`text-[11px] font-bold font-sans tracking-wide ${
                                    isSelected
                                      ? "text-slate-900 dark:text-white"
                                      : "text-slate-700 dark:text-zinc-300 group-hover:text-brand-amber transition-colors"
                                  }`}
                                >
                                  {month.enShort}
                                </span>
                                {isSelected && (
                                  <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white animate-pulse" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {/* Footer hint */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-purple-950/20 text-center flex items-center justify-center gap-1 text-[9px] text-zinc-405">
                          <Sparkles className="w-2.5 h-2.5 text-brand-amber" />
                          <span className="text-slate-600 dark:text-zinc-400">
                            {t("header.sessionInfo")}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-0.5 mt-0.5">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                <span>ID: {messId}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-brand-amber transition-colors cursor-pointer"
                  title="Copy Mess ID"
                  id="btn-copy-mess-id"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              
              {/* Real-time Google Cloud Sync Tracking State Indicators */}
              {isSyncing ? (
                <div className="text-[8.5px] sm:text-[9.5px] text-amber-400 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                  <span>{t("header.cloudSyncing")}</span>
                </div>
              ) : lastCloudSync ? (
                <div className="text-[8.5px] sm:text-[9.5px] text-emerald-400 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>{t("header.cloudSecure")} ({lastCloudSync})</span>
                </div>
              ) : (
                <div className="text-[8.5px] sm:text-[9.5px] text-emerald-500/80 font-sans flex items-center gap-1 leading-none select-none tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 inline-block" />
                  <span>{t("header.cloudSaved")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-3">
          {/* History Button */}
          <button
            onClick={onShowHistory}
            className="p-1.5 rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            title={t("header.historyPdf")}
          >
            <History className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
          
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full border bg-slate-50 dark:bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] ${
                isLangOpen
                  ? "border-brand-accent text-brand-amber bg-slate-100 dark:bg-zinc-850"
                  : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-800 dark:text-zinc-200"
              }`}
              title={t("nav.changeLang")}
            >
              <Globe className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span className="font-sans font-bold uppercase tracking-wide">
                {language === 'en' ? 'EN' : language === 'bn' ? 'BN' : language === 'ar' ? 'AR' : 'HI'}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-600 dark:text-zinc-400 shrink-0 transition-transform duration-300 ${isLangOpen ? "rotate-180 text-brand-accent" : ""}`}
              />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute end-0 mt-2 w-32 bg-white dark:bg-brand-card shadow-sm dark:shadow-none border border-slate-200 dark:border-purple-950/80 rounded-2xl p-2 shadow-xl z-50 overflow-hidden"
                >
                  {(['en', 'bn', 'ar', 'hi'] as LanguageType[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${language === lang ? 'bg-purple-600 text-white' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {lang === 'en' ? 'English' : lang === 'bn' ? 'বাংলা' : lang === 'ar' ? 'العربية' : 'हिन्दी'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:text-brand-amber transition-all cursor-pointer"
            id="btn-theme-toggle"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-4 sm:h-4" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
