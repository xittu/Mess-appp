const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{\n                  onClose\(\);\n                  if \(onOpenFindMess\) onOpenFindMess\(\);\n                \}\}/g,
  `type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                  if (onOpenFindMess) onOpenFindMess();
                }}`
);
fs.writeFileSync('src/components/SideMenu.tsx', code);
