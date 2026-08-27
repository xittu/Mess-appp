import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_loading = """  // --- Render Loading Interface ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F0C15] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <Sparkles className="w-8 h-8 text-brand-amber animate-spin mb-3" />
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-400 tracking-widest uppercase">
          মেস নেটওয়ার্ক সংযোগ হচ্ছে...
        </span>
      </div>
    );
  }"""

new_loading = """  // --- Render Loading Interface ---
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0f0d17] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 select-none font-sans transition-colors duration-300">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 rounded-full animate-ping blur-sm"></div>
          <div className="relative bg-white dark:bg-zinc-900/80 p-4 rounded-full shadow-lg border border-slate-200 dark:border-zinc-800/80 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 tracking-widest uppercase animate-pulse text-center max-w-[80%]">
          {t("loading.network")}
        </span>
      </div>
    );
  }"""

content = content.replace(old_loading, new_loading)

with open('src/App.tsx', 'w') as f:
    f.write(content)

