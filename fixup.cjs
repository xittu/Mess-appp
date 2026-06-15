const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setMessName\(([^,]+),\s*bazaarList\)/g, "setMessName($1)");

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed setMessName');
