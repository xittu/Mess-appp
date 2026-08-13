const fs = require('fs');
const path = require('path');

const mappings = [
  { pattern: /(?<!dark:)bg-\[#120e20\]/g, replacement: 'bg-white dark:bg-[#120e20]' },
  { pattern: /(?<!dark:)bg-\[#18142c\]/g, replacement: 'bg-white dark:bg-[#18142c]' },
  { pattern: /(?<!dark:)bg-\[#18122B\]/g, replacement: 'bg-white dark:bg-[#18122B]' },
  { pattern: /(?<!dark:)bg-\[#0F0C15\]/g, replacement: 'bg-slate-50 dark:bg-[#0F0C15]' },
  { pattern: /(?<!dark:)bg-gradient-to-tr from-\[#1E1236\] to-\[#2B1B4A\]/g, replacement: 'bg-gradient-to-tr from-white to-slate-50 dark:from-[#1E1236] dark:to-[#2B1B4A]' },
  // Auth Screen
  { pattern: /(?<!dark:)bg-\[#0E0A16\]/g, replacement: 'bg-slate-50 dark:bg-[#0E0A16]' },
  { pattern: /(?<!dark:)bg-\[#130F22\]/g, replacement: 'bg-white dark:bg-[#130F22]' },
  { pattern: /(?<!dark:)bg-\[#0D091B\]/g, replacement: 'bg-slate-50 dark:bg-[#0D091B]' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  mappings.forEach(m => {
    content = content.replace(m.pattern, m.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed hex backgrounds in ' + filePath);
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
