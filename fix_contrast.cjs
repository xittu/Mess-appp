const fs = require('fs');
const path = require('path');

const mappings = [
  { pattern: /text-slate-600/g, replacement: 'text-slate-700' },
  { pattern: /text-slate-500/g, replacement: 'text-slate-600' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  mappings.forEach(m => {
    content = content.replace(m.pattern, m.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed contrast in ' + filePath);
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
