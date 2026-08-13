const fs = require('fs');
const path = require('path');

const mappings = [
  // Header
  { pattern: /hover:text-white hover:border-brand-accent\/30 hover:bg-slate-50 dark:hover:bg-zinc-900/g, replacement: 'hover:text-slate-900 dark:hover:text-white hover:border-brand-accent/30 hover:bg-slate-50 dark:hover:bg-zinc-900' },
  // NoticePopup
  { pattern: /(?<!dark:)hover:text-white bg-slate-200 dark:bg-black\/20 hover:bg-slate-200 dark:hover:bg-black\/40/g, replacement: 'hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-black/20 hover:bg-slate-300 dark:hover:bg-black/40' },
  // PasswordChangeModal
  { pattern: /(?<!dark:)hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/g, replacement: 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800' },
  // LandingPage
  { pattern: /border-purple-500\/30 text-white hover:bg-purple-500\/10/g, replacement: 'border-purple-500/30 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-purple-500/10' },
  // AdminPanel
  { pattern: /hover:bg-red-500 hover:text-slate-900 dark:hover:text-white/g, replacement: 'hover:bg-red-500 hover:text-white' }, // Wait, bg-red-500 with text-slate-900 is bad. White text on red is good.
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  mappings.forEach(m => {
    content = content.replace(m.pattern, m.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed text-white in ' + filePath);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

processDir('src/components');
processFile('src/App.tsx');
