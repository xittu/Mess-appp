const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

code = code.replace(
  '"dutyTitle": "Mess Duty & Roles",',
  '"dutyTitle": "Mess Duty & Roles",\n      "finalLedgerBtn": "Final Ledger",\n      "finalLedgerDesc": "Real-time mess calculator & refund dashboard",\n      "dutiesBtn": "Duties & Rules",\n      "dutiesDesc": "Mess schedule and member responsibilities",'
);
code = code.replace(
  '"dutyTitle": "মেস ডিউটি ও দায়িত্ব",',
  '"dutyTitle": "মেস ডিউটি ও দায়িত্ব",\n      "finalLedgerBtn": "হিসাব (Final Ledger)",\n      "finalLedgerDesc": "রিয়েল-টাইম মেস ক্যালকুলেটর ও রিফান্ড ড্যাশবোর্ড",\n      "dutiesBtn": "ডিউটি ও রুলস (Duties)",\n      "dutiesDesc": "মেস শিডিউল ও সদস্যদের দায়িত্বসমূহ",'
);
code = code.replace(
  '"dutyTitle": "الواجبات والأدوار",',
  '"dutyTitle": "الواجبات والأدوار",\n      "finalLedgerBtn": "دفتر الأستاذ النهائي",\n      "finalLedgerDesc": "آلة حاسبة للفوضى في الوقت الفعلي ولوحة معلومات استرداد الأموال",\n      "dutiesBtn": "الواجبات والقواعد",\n      "dutiesDesc": "جدول الفوضى ومسؤوليات الأعضاء",'
);
code = code.replace(
  '"dutyTitle": "मेस ड्यूटी और भूमिकाएं",',
  '"dutyTitle": "मेस ड्यूटी और भूमिकाएं",\n      "finalLedgerBtn": "अंतिम खाता (Final Ledger)",\n      "finalLedgerDesc": "रीयल-टाइम मेस कैलकुलेटर और रिफंड डैशबोर्ड",\n      "dutiesBtn": "ड्यूटी और नियम (Duties)",\n      "dutiesDesc": "मेस शेड्यूल और सदस्यों की जिम्मेदारियां",'
);

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Translations added for buttons");
