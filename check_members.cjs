const fs = require('fs');
const code = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = code.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const translations = JSON.parse(objStr);

console.log("en members:", Object.keys(translations.en.members));
console.log("hi members:", Object.keys(translations.hi.members));
