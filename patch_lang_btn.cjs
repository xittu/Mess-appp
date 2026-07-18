const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  '{t("sideMenu.langBtn")}',
  '{t("sideMenu.changeLang")}'
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
console.log("Patched langBtn");
