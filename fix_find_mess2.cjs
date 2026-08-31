const fs = require('fs');
let code = fs.readFileSync('src/components/FindMessTab.tsx', 'utf8');
code = code.replace(/loc\.user_id\.substring/g, '(loc.user_id || "").substring');
fs.writeFileSync('src/components/FindMessTab.tsx', code);
