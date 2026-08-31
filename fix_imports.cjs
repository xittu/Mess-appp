const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  `import {
  History,`,
  `import {
  Sun, Moon, Monitor,
  History,`
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
