const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `            <div key="find-mess-modal" className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-200 dark:bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col relative my-8"
              >
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-zinc-800">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Global Mess Network</h2>
                  <button onClick={() => setIsFindMessOpen(false)} className="p-2 bg-slate-200 dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">`,
  `            <div key="find-mess-modal" className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-200 dark:bg-black/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl max-h-[90vh] bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-zinc-800 shrink-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{t("sideMenu.globalMessNetwork") || "Global Mess Network"}</h2>
                  <button onClick={() => setIsFindMessOpen(false)} className="p-2 bg-rose-500/10 dark:bg-rose-500/20 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2 px-4">
                    <span className="font-semibold text-sm">Close</span>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto">`
);

fs.writeFileSync('src/App.tsx', code);
