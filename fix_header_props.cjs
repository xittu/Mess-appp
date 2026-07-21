const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
code = code.replace(/  notifications: Array<\{[\s\S]*?\}>;\n  onShowNotifications: \(\) => void;\n/, '');
code = code.replace(/  notifications,\n  onShowNotifications,\n/, '');
code = code.replace(/const unreadCount = notifications\.filter\(\(n\) => \!n\.read\)\.length;\n/, '');
fs.writeFileSync('src/components/Header.tsx', code);
