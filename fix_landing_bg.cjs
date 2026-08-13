const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(/className="bg-slate-50 dark:bg-zinc-900\/50 border border-purple-900\/40/g, 'className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-purple-900/40 shadow-sm dark:shadow-none');

content = content.replace(/className="bg-slate-50 dark:bg-zinc-900\/40 border border-slate-200 dark:border-purple-950\/30 rounded-3xl p-6 hover:bg-slate-50/g, 'className="bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-purple-950/30 rounded-3xl p-6 hover:bg-slate-50 shadow-sm dark:shadow-none');

content = content.replace(/bg-slate-50 dark:bg-\[#0F0C15\] rounded-2xl flex items-center justify-center border border-purple-900\/20/g, 'bg-slate-50 dark:bg-[#0F0C15] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-purple-900/20');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed LandingPage card backgrounds');
