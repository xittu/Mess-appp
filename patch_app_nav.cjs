const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<span className="text-[10px] font-sans">সদস্য</span>',
  '<span className="text-[10px] font-sans">{t("nav.members")}</span>'
);
code = code.replace(
  '<span className="text-[10px] font-sans">খরচ</span>',
  '<span className="text-[10px] font-sans">{t("nav.expenses")}</span>'
);
code = code.replace(
  '<span className="text-[10px] font-sans">মিল</span>',
  '<span className="text-[10px] font-sans">{t("nav.meals")}</span>'
);
code = code.replace(
  '<span className="text-[10px] font-sans">জমা</span>',
  '<span className="text-[10px] font-sans">{t("nav.deposits")}</span>'
);
code = code.replace(
  '<span className="text-[10px] font-sans">বাজার</span>',
  '<span className="text-[10px] font-sans">{t("nav.bazaar")}</span>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched");
