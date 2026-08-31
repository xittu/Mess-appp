const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  `{/* Theme Toggle */}
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
          </button>`,
  `{/* Theme toggle moved to settings */}`
);

fs.writeFileSync('src/components/Header.tsx', code);
