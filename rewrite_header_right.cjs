const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const rightSideCode = `
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={onShowHistory}
            className="p-1.5 rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            title={t("header.historyPdf")}
          >
            <History className="w-4 h-4" />
          </button>
          
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={\`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] \${
                isLangOpen
                  ? "border-brand-accent text-brand-amber bg-zinc-850"
                  : "border-zinc-800 hover:border-zinc-700 text-zinc-200"
              }\`}
              title={t("nav.changeLang")}
            >
              <Globe className="w-3 h-3 text-brand-accent shrink-0" />
              <span className="font-sans uppercase tracking-wider">
                {language === 'en' ? 'EN' : language === 'bn' ? 'BN' : language === 'ar' ? 'AR' : 'HI'}
              </span>
              <ChevronDown
                className={\`w-2.5 h-2.5 text-zinc-400 shrink-0 transition-transform duration-300 \${isLangOpen ? "rotate-180 text-brand-accent" : ""}\`}
              />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute end-0 mt-2 w-32 bg-brand-card border border-purple-950/80 rounded-2xl p-2 shadow-xl z-50 overflow-hidden"
                >
                  {(['en', 'bn', 'ar', 'hi'] as LanguageType[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={\`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer \${language === lang ? 'bg-purple-600 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}\`}
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
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-brand-amber transition-all cursor-pointer"
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
`;

// Replace everything from `<div className="flex items-center gap-3">` to the end of the file, except the closing tags.
// Since it's at the end of the component, we can use regex.
const endRegex = /<div className="flex items-center gap-3">[\s\S]*?<\/header>/;

code = code.replace(endRegex, rightSideCode.trim() + '\n      </div>\n    </header>');

fs.writeFileSync('src/components/Header.tsx', code);
