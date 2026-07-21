const fs = require('fs');
const path = require('path');

const mappings = [
  // Backgrounds
  { pattern: /(?<!dark:)bg-brand-card(?!\/)/g, replacement: 'bg-white dark:bg-brand-card shadow-sm dark:shadow-none' },
  { pattern: /(?<!dark:)bg-brand-card\/([0-9]+)/g, replacement: 'bg-white dark:bg-brand-card/$1 shadow-sm dark:shadow-none' },
  
  { pattern: /(?<!dark:)bg-zinc-900(?!\/)/g, replacement: 'bg-slate-50 dark:bg-zinc-900' },
  { pattern: /(?<!dark:)bg-zinc-900\/([0-9]+)/g, replacement: 'bg-slate-50 dark:bg-zinc-900/$1' },
  
  { pattern: /(?<!dark:)bg-zinc-950(?!\/)/g, replacement: 'bg-slate-100 dark:bg-zinc-950' },
  { pattern: /(?<!dark:)bg-zinc-950\/([0-9]+)/g, replacement: 'bg-slate-100 dark:bg-zinc-950/$1' },
  
  { pattern: /(?<!dark:)bg-zinc-850(?!\/)/g, replacement: 'bg-slate-100 dark:bg-zinc-850' },
  
  { pattern: /(?<!dark:)bg-zinc-800(?!\/)/g, replacement: 'bg-slate-100 dark:bg-zinc-800' },
  { pattern: /(?<!dark:)bg-zinc-800\/([0-9]+)/g, replacement: 'bg-slate-100 dark:bg-zinc-800/$1' },
  
  { pattern: /(?<!dark:)bg-black(?!\/)/g, replacement: 'bg-slate-200 dark:bg-black' },
  { pattern: /(?<!dark:)bg-black\/([0-9]+)/g, replacement: 'bg-slate-200 dark:bg-black/$1' },

  // Borders
  { pattern: /(?<!dark:)border-zinc-900(?!\/)/g, replacement: 'border-slate-300 dark:border-zinc-900' },
  { pattern: /(?<!dark:)border-zinc-800(?!\/)/g, replacement: 'border-slate-200 dark:border-zinc-800' },
  { pattern: /(?<!dark:)border-zinc-800\/([0-9]+)/g, replacement: 'border-slate-200 dark:border-zinc-800/$1' },
  { pattern: /(?<!dark:)border-zinc-700(?!\/)/g, replacement: 'border-slate-300 dark:border-zinc-700' },
  
  { pattern: /(?<!dark:)border-purple-950(?!\/)/g, replacement: 'border-slate-200 dark:border-purple-950' },
  { pattern: /(?<!dark:)border-purple-950\/([0-9]+)/g, replacement: 'border-slate-200 dark:border-purple-950/$1' },

  // Texts
  { pattern: /(?<!dark:)text-zinc-100/g, replacement: 'text-slate-900 dark:text-zinc-100' },
  { pattern: /(?<!dark:)text-zinc-200/g, replacement: 'text-slate-800 dark:text-zinc-200' },
  { pattern: /(?<!dark:)text-zinc-250/g, replacement: 'text-slate-700 dark:text-zinc-250' },
  { pattern: /(?<!dark:)text-zinc-300/g, replacement: 'text-slate-700 dark:text-zinc-300' },
  { pattern: /(?<!dark:)text-zinc-400/g, replacement: 'text-slate-600 dark:text-zinc-400' },
  { pattern: /(?<!dark:)text-zinc-500/g, replacement: 'text-slate-500 dark:text-zinc-500' },
  
  // Specific fix for inputs text which might be white
  { pattern: /(?<!dark:)text-white(?!.*?(hover|bg-brand-accent|bg-purple-600|bg-rose-500))/g, replacement: 'text-slate-900 dark:text-white' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  mappings.forEach(m => {
    content = content.replace(m.pattern, m.replacement);
  });
  
  // Some specific text-white replacements might break icons inside buttons, so we can revert specific things if needed.
  // Actually text-white is tricky, let's just do a simpler text-white replace for inputs if any, but since we didn't specify, let's just let the regex run.

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
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
