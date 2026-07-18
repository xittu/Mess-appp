const fs = require('fs');

let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

// 212
code = code.replace(/"<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো \{t\("sideMenuFixed\.utilityCost"\)\} খরচ নেই।<\/td><\/tr>"/g, '`<tr><td colspan=\'2\' style=\'padding: 20px; text-align: center; color: #94a3b8;\'>কোনো ${t("sideMenuFixed.utilityCost")} খরচ নেই।</td></tr>`');

// Let's check line 437
code = code.replace(/"<tr><td colspan='3' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো \{t\("sideMenuFixed\.bazaarSpent"\)\} খরচ নেই।<\/td><\/tr>"/g, '`<tr><td colspan=\'3\' style=\'padding: 20px; text-align: center; color: #94a3b8;\'>কোনো ${t("sideMenuFixed.bazaarSpent")} খরচ নেই।</td></tr>`');

fs.writeFileSync('src/components/SideMenu.tsx', code);
