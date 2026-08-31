const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
if (!code.includes('ArrowLeft')) {
  code = code.replace(
    `Sun, Moon, Monitor,`,
    `Sun, Moon, Monitor, ArrowLeft, CheckCircle2,`
  );
}
fs.writeFileSync('src/components/SideMenu.tsx', code);
