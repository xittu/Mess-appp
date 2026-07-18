const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  '← মূল মেনু ফিরে যান',
  '← {t("sideMenu.backToMenu")}'
);

code = code.replace(
  '{activeModal === "ledger"\n                  ? "চূড়ান্ত হিসাব"\n                  : "মেস ডিউটি ও দায়িত্ব"}',
  '{activeModal === "ledger"\n                  ? t("sideMenu.ledgerTitle")\n                  : t("sideMenu.dutyTitle")}'
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
console.log("Patched sideMenu inner translation hooks");
