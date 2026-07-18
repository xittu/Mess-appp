const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

code = code.replace(/meals: "Meals",/g, 'meals: "Meals",\n      deposits: "Deposits",');
code = code.replace(/meals: "মিলস",/g, 'meals: "মিলস",\n      deposits: "জমা",');
code = code.replace(/meals: "وجبات",/g, 'meals: "وجبات",\n      deposits: "الودائع",');
code = code.replace(/meals: "भोजन",/g, 'meals: "भोजन",\n      deposits: "जमा",');

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Nav translations added");
