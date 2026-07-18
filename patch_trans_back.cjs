const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

code = code.replace(
  '"menuTitle": "Menu",',
  '"menuTitle": "Menu",\n      "backToMenu": "Back to Menu",\n      "ledgerTitle": "Final Calculation",\n      "dutyTitle": "Mess Duty & Roles",'
);
code = code.replace(
  '"menuTitle": "মেনু",',
  '"menuTitle": "মেনু",\n      "backToMenu": "মূল মেনু ফিরে যান",\n      "ledgerTitle": "চূড়ান্ত হিসাব",\n      "dutyTitle": "মেস ডিউটি ও দায়িত্ব",'
);
code = code.replace(
  '"menuTitle": "القائمة",',
  '"menuTitle": "القائمة",\n      "backToMenu": "العودة للقائمة",\n      "ledgerTitle": "الحساب النهائي",\n      "dutyTitle": "الواجبات والأدوار",'
);
code = code.replace(
  '"menuTitle": "मेनू",',
  '"menuTitle": "मेनू",\n      "backToMenu": "मेनू पर वापस जाएं",\n      "ledgerTitle": "अंतिम गणना",\n      "dutyTitle": "मेस ड्यूटी और भूमिकाएं",'
);

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Translations added for back string and ledger/duty titles");
