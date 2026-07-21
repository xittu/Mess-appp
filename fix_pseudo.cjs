const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Fix pseudo-classes: hover:bg-slate-100 dark:bg-zinc-800 -> hover:bg-slate-100 dark:hover:bg-zinc-800
  // and so on.
  // The pattern is: (hover|focus|active|group-hover):([a-zA-Z0-9-\/]+) dark:([a-zA-Z0-9-\/]+)
  content = content.replace(/(hover|focus|active|group-hover):([a-zA-Z0-9-\/]+) dark:([a-zA-Z0-9-\/]+)/g, '$1:$2 dark:$1:$3');

  // Also fix cases where there's a pseudo-class with shadow:
  // e.g. group-hover:bg-white dark:bg-brand-card shadow-sm dark:shadow-none
  // -> group-hover:bg-white dark:group-hover:bg-brand-card group-hover:shadow-sm dark:group-hover:shadow-none
  // Wait, let's just do it broadly for the specific ones we broke.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed pseudo in ' + filePath);
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
