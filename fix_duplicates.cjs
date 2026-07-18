const fs = require('fs');

let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

// I will look for `expenses: {\n      voiceInput` and change it to `expensesVoice: {\n      voiceInput`
code = code.replace(/expenses: \{\s*voiceInput/g, 'expensesVoice: {\n      voiceInput');

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Renamed duplicate expenses to expensesVoice");
