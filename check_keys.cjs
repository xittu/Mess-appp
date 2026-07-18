const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = code.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const translations = JSON.parse(objStr);

for (const lang of ['en', 'bn', 'ar', 'hi']) {
  console.log(`--- ${lang} ---`);
  console.log(Object.keys(translations[lang]));
}
