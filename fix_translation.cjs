const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
code = code.replace(
  `cursor-pointer text-center leading-tight"
                >
                  Password`,
  `cursor-pointer text-center leading-tight"
                >
                  {t("sideMenu.changePassword")}`
);
fs.writeFileSync('src/components/SideMenu.tsx', code);
