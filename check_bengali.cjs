const fs = require('fs');
const code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, i) => {
  if (/[\u0980-\u09FF]/.test(line)) {
    console.log(`SideMenu.tsx:${i + 1}: ${line.trim()}`);
  }
});
