const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  `onOpenFindMess?: () => void;`,
  `onOpenFindMess?: () => void;\n  theme?: 'light' | 'dark' | 'system';\n  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;`
);

code = code.replace(
  `onOpenFindMess,\n}: SideMenuProps) {`,
  `onOpenFindMess,\n  theme = 'system',\n  onThemeChange,\n}: SideMenuProps) {`
);

code = code.replace(
  `"ledger" | "duty" | "fixed_meal_info" | "job_register" | "export_pdf" | "new_session" | "old_sessions" | "language" | null`,
  `"ledger" | "duty" | "fixed_meal_info" | "job_register" | "export_pdf" | "new_session" | "old_sessions" | "language" | "theme" | null`
);

code = code.replace(
  `<div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveModal("language")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 text-brand-amber transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {t("sideMenu.changeLang")}
                </button>
                <button
                  onClick={() => {
                    if (currentUserEmail) {
                      setShowPasswordChange(true);
                    } else {
                      alert(t("sideMenuFixed.emailNotFound"));
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  {t("sideMenu.changePassword")}
                </button>
              </div>`,
  `<div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveModal("theme")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Sun className="w-3.5 h-3.5" />
                  Theme
                </button>
                <button
                  onClick={() => setActiveModal("language")}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 text-brand-amber transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {t("sideMenu.changeLang")}
                </button>
                <button
                  onClick={() => {
                    if (currentUserEmail) {
                      setShowPasswordChange(true);
                    } else {
                      alert(t("sideMenuFixed.emailNotFound"));
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer text-center leading-tight"
                >
                  Password
                </button>
              </div>`
);

// Add theme modal content
code = code.replace(
  `{activeModal === "language" && (`,
  `{activeModal === "theme" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                <div className="flex items-center gap-3 text-slate-900 dark:text-zinc-100 mb-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-bold text-[15px] font-sans">App Theme</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System Default', icon: Monitor }
                  ].map((tOpt) => {
                    const Icon = tOpt.icon;
                    return (
                      <button
                        key={tOpt.id}
                        onClick={() => onThemeChange?.(tOpt.id as 'light' | 'dark' | 'system')}
                        className={\`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer \${
                          theme === tOpt.id
                            ? "bg-brand-accent/10 border-brand-accent/30 text-brand-accent shadow-sm"
                            : "bg-slate-50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        }\`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-semibold text-sm">{tOpt.label}</span>
                        </div>
                        {theme === tOpt.id && (
                          <div className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {activeModal === "language" && (`
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
