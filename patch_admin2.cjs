const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/notice\.date/g, 'notice.created_at');
code = code.replace(/notice\.isActive/g, 'notice.is_active');
code = code.replace(/notice\.message/g, 'notice.content');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
