const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Change padding from py-3 to py-2
code = code.replace(/px-4 py-3/g, 'px-3 py-2');

// 2. Remove the old left side month span:
// <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent font-semibold border border-brand-accent/20 flex items-center gap-1.5 shadow-sm">
//   <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse shadow-sm" />
//   {currentMonthDetail.bnFull}
// </span>
const leftSpanRegex = /<span className="text-xs px-2\.5 py-0\.5 rounded-full bg-brand-accent\/10 text-brand-accent font-semibold border border-brand-accent\/20 flex items-center gap-1\.5 shadow-sm">[\s\S]*?<\/span>/;

// 3. The Month picker code to insert on the left:
const monthPickerCode = `
          {/* Custom Trendy Calendar Month Picker (Moved from Right) */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className={\`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] \${
                isPickerOpen
                  ? "border-brand-accent text-brand-amber bg-zinc-850"
                  : "border-brand-accent/20 hover:border-zinc-700 text-brand-accent bg-brand-accent/5"
              }\`}
              id="select-month-picker"
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate font-sans">
                {currentMonthDetail.bnFull}
              </span>
              <ChevronDown
                className={\`w-3 h-3 shrink-0 transition-transform duration-300 \${isPickerOpen ? "rotate-180" : ""}\`}
              />
            </button>
            <AnimatePresence>
              {isPickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 mt-2 w-[310px] bg-brand-card border border-purple-950/80 rounded-2xl p-3.5 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.85),_0_0_15px_rgba(168,85,247,0.15)] z-50 overflow-hidden"
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
                          className={\`relative group flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer text-center overflow-hidden active:scale-95 \${
                            isSelected
                              ? "bg-gradient-to-br from-brand-accent to-purple-600 text-white font-medium shadow-[0_4px_12px_rgba(168,85,247,0.3)] border-brand-accent"
                              : "bg-zinc-950/60 border-zinc-900 text-zinc-300 hover:text-white hover:border-brand-accent/30 hover:bg-zinc-900"
                          }\`}
                        >
                          {/* Visual hover color splash */}
                          {!isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/5 duration-300" />
                          )}
                          <span
                            className={\`text-[8px] font-mono tracking-wider font-semibold uppercase mb-0.5 \${
                              isSelected
                                ? "text-purple-200"
                                : "text-brand-accent/50 group-hover:text-brand-accent"
                            }\`}
                          >
                            {month.enShort}
                          </span>
                          <span
                            className={\`text-xs font-bold font-sans \${
                              isSelected
                                ? "text-white"
                                : "text-zinc-250 group-hover:text-brand-amber transition-colors"
                            }\`}
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
                      {t("header.sessionInfo")}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
`;

code = code.replace(leftSpanRegex, monthPickerCode.trim());

// 4. Now remove the old month picker from the right side completely
const rightPickerRegex = /<div className="relative" ref=\{pickerRef\}>[\s\S]*?<\/AnimatePresence>\s*<\/div>/g;
code = code.replace(rightPickerRegex, '');

// 5. Transform the language selector into a pill on the right side
const oldLanguageSelectorRegex = /<div className="relative" ref=\{langRef\}>[\s\S]*?<button\s+onClick=\{\(\) => setIsLangOpen\(\!isLangOpen\)\}\s+className=\{`p-2 rounded-lg transition-all cursor-pointer \$\{isLangOpen \? 'bg-purple-900\/40 text-purple-400 border border-purple-500\/30' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-brand-amber'\}`\}\s+title=\{t\("nav\.changeLang"\)\}\s*>\s*<Globe className="w-4 h-4" \/>\s*<\/button>/;

const newLanguageSelector = `
          {/* Language Selector (Now Prominent on the Right) */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={\`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border bg-zinc-900 transition-all duration-300 select-none cursor-pointer hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] \${
                isLangOpen
                  ? "border-brand-accent text-brand-amber bg-zinc-850"
                  : "border-zinc-800 hover:border-zinc-700 text-zinc-200"
              }\`}
              title={t("nav.changeLang")}
              style={{ minWidth: "110px" }}
            >
              <Globe className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span className="flex-1 text-left truncate font-sans">
                {language === 'en' ? 'English' : language === 'bn' ? 'বাংলা' : language === 'ar' ? 'العربية' : 'हिन्दी'}
              </span>
              <ChevronDown
                className={\`w-3 h-3 text-zinc-400 shrink-0 transition-transform duration-300 \${isLangOpen ? "rotate-180 text-brand-accent" : ""}\`}
              />
            </button>
`;

code = code.replace(oldLanguageSelectorRegex, newLanguageSelector.trim());

fs.writeFileSync('src/components/Header.tsx', code);
