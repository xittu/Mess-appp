const fs = require('fs');
const code = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = code.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const translations = JSON.parse(objStr);

console.log("en deposits:", Object.keys(translations.en.deposits));
console.log("bn deposits:", Object.keys(translations.bn.deposits));
console.log("ar deposits:", Object.keys(translations.ar.deposits));
console.log("hi deposits:", Object.keys(translations.hi.deposits));
