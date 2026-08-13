const fs = require('fs');
const path = require('path');

const mappings = [
  { pattern: /(?<!dark:)hover:bg-zinc-700/g, replacement: 'hover:bg-slate-200 dark:hover:bg-zinc-700' },
  { pattern: /(?<!dark:)hover:bg-zinc-850\/90/g, replacement: 'hover:bg-slate-100 dark:hover:bg-zinc-850/90' },
  { pattern: /(?<!dark:)hover:bg-zinc-850\/50/g, replacement: 'hover:bg-slate-100 dark:hover:bg-zinc-850/50' },
  { pattern: /(?<!dark:)hover:bg-zinc-850\/80/g, replacement: 'hover:bg-slate-100 dark:hover:bg-zinc-850/80' },
  { pattern: /(?<!dark:)border-zinc-700\/60/g, replacement: 'border-slate-300 dark:border-zinc-700/60' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  mappings.forEach(m => {
    content = content.replace(m.pattern, m.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed hover backgrounds in ' + filePath);
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
