const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/"zz@z\.com"/g, 'getMockUser().email');
fs.writeFileSync('src/App.tsx', code);
