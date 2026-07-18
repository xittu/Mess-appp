const fs = require('fs');

let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

// I will just change my injected `deposits:` to `deposits2:` and `meals:` to `meals2:`,
// then update the components `DepositsTab.tsx` and `MealsTab.tsx` to use `deposits2.` and `meals2.`.
// This is much safer and easier!

code = code.replace(/deposits: \{\n      totalDepositsTitle/g, 'deposits2: {\n      totalDepositsTitle');
code = code.replace(/meals: \{\n      activeMembers/g, 'meals2: {\n      activeMembers');

fs.writeFileSync('src/i18n/translations.ts', code);

let depCode = fs.readFileSync('src/components/DepositsTab.tsx', 'utf8');
depCode = depCode.replace(/t\("deposits\./g, 't("deposits2.');
fs.writeFileSync('src/components/DepositsTab.tsx', depCode);

let mealCode = fs.readFileSync('src/components/MealsTab.tsx', 'utf8');
mealCode = mealCode.replace(/t\("meals\./g, 't("meals2.');
fs.writeFileSync('src/components/MealsTab.tsx', mealCode);

console.log("Renamed to deposits2 and meals2");
