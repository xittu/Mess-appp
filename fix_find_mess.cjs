const fs = require('fs');
let code = fs.readFileSync('src/components/FindMessTab.tsx', 'utf8');
code = code.replace(/currentUser\.id/g, 'currentUser?.id');
fs.writeFileSync('src/components/FindMessTab.tsx', code);
