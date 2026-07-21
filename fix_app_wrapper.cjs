const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /className=\{`min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col w-full overflow-x-hidden \$\{\n\s*darkMode \? "bg-brand-bg text-slate-900 dark:text-zinc-100" : "bg-\[#FAFAFE\] text-zinc-800"\n\s*\}`\}/,
  'className="min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col w-full overflow-x-hidden"'
);

fs.writeFileSync('src/App.tsx', code);
