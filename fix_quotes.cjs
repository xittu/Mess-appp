const fs = require('fs');

let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(/"\{t\("sideMenuFixed\.roleBazaar"\)\}"/g, 't("sideMenuFixed.roleBazaar")');
code = code.replace(/"\{t\("sideMenuFixed\.roleCooking"\)\}"/g, 't("sideMenuFixed.roleCooking")');

// I also might have done that for SideMenu.tsx(97,57) which is something about sideMenuFixed.roleBazaar.
// Actually, let's fix the same in PasswordChangeModal.tsx and ExpensesTab.tsx if they have similar issues.
// Let's check where else this happened.

// There's a string literal replacement issue with `সাপ্তাহিক বাজার দায়িত্ব` as well in SideMenu.
code = code.replace(/সাপ্তাহিক \{t\("sideMenuFixed\.roleBazaar"\)\}/g, '{t("sideMenuFixed.roleBazaarDesc")}');

// In SideMenu line 1347: `src/components/SideMenu.tsx(1347,17): error TS1128: Declaration or statement expected.`
// I'll just write it to a file and run lint again to see if it improves.
fs.writeFileSync('src/components/SideMenu.tsx', code);
