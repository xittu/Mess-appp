const fs = require('fs');
let code = fs.readFileSync('src/components/MealsTab.tsx', 'utf8');

code = code.replace(
  /এই মাসের জন্য কোনো নির্দিষ্ট ডাবল বা সিঙ্গেল মিল রেট নির্ধারণ করা\s*হয়নি। সঠি হিসাব নিকাশের জন্য নির্ধারিত মিল যোগ করুন।/g,
  '{t("meals.noMealsDesc")}'
);
code = code.replace(
  /নির্ধারণকৃত মিল সংখ্যা চলমান মেস সেশনের অন্তর্ভুক্ত সকল সক্রিয়\s*মেম্বারদের জন্য সমানভাবে কার্যকর করা হবে।/g,
  '{t("meals.setMealsDesc")}'
);

fs.writeFileSync('src/components/MealsTab.tsx', code);
console.log("MealsTab desc patched");
