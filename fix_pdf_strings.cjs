const fs = require('fs');

let oldCode = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = oldCode.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const trans = JSON.parse(objStr);

const updates = {
  en: {
    sideMenuFixed: {
      pdfPopupAllow: "Please allow pop-ups to generate PDF.",
      noBazaarAdded: "No bazaar expenses added.",
      noUtilityAdded: "No utility bills added.",
      oldSessionReport: "Old Session Mess Account Report",
      bazaarCostLbl: "Bazaar Cost",
      totalUtilityCost: "Total Utility Cost",
      grandTotal: "Grand Total",
      finalAccountMembers: "Members Final Account",
      nameCol: "Name",
      ownBazaar: "Own Bazaar",
      mealsCol: "Meals",
      bazaarCostCol: "Bazaar Cost",
      currentStatus: "Current Status",
      bazaarList: "Bazaar Expenses List",
      descCol: "Description",
      amountCol: "Amount",
      utilityList: "Utility Bills List",
      sectorCol: "Sector/Bill Name",
      messUtilityBill: "Mess Utility Bill",
      noBazaarCurrent: "No bazaar expenses added in the current month.",
      noUtilityCurrent: "No separate utility bills added."
    }
  },
  bn: {
    sideMenuFixed: {
      pdfPopupAllow: "পিডিএফ জেনারেট সম্পন্ন করতে অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।",
      noBazaarAdded: "কোনো বাজার খরচ নেই।",
      noUtilityAdded: "কোনো ইউটিলিটি খরচ নেই।",
      oldSessionReport: "পুরনো সেশন মেস হিসাব বিবরণী",
      bazaarCostLbl: "বাজার খরচ",
      totalUtilityCost: "মোট ইউটিলিটি খরচ",
      grandTotal: "সর্বমোট খরচ",
      finalAccountMembers: "সদস্যদের চূড়ান্ত হিসাব",
      nameCol: "নাম",
      ownBazaar: "নিজের বাজার",
      mealsCol: "মিল",
      bazaarCostCol: "বাজার খরচ",
      currentStatus: "বর্তমান অবস্থা",
      bazaarList: "বাজার খরচের তালিকা",
      descCol: "বিবরণ",
      amountCol: "টাকা",
      utilityList: "ইউটিলিটি খরচের তালিকা",
      sectorCol: "খাতের নাম",
      messUtilityBill: "মেস ইউটিলিটি বিল",
      noBazaarCurrent: "চলমান মাসে কোনো বাজার খরচ যুক্ত করা হয়নি।",
      noUtilityCurrent: "কোনো আলাদা ইউটিলিটি বিল যুক্ত করা হয়নি।"
    }
  },
  ar: {
    sideMenuFixed: {
      pdfPopupAllow: "يرجى السماح بالنوافذ المنبثقة لإنشاء ملف PDF.",
      noBazaarAdded: "لم يتم إضافة مصاريف سوق.",
      noUtilityAdded: "لم يتم إضافة فواتير مرافق.",
      oldSessionReport: "تقرير حساب فوضى الجلسة القديمة",
      bazaarCostLbl: "تكلفة السوق",
      totalUtilityCost: "إجمالي تكلفة المرافق",
      grandTotal: "المبلغ الإجمالي",
      finalAccountMembers: "الحساب النهائي للأعضاء",
      nameCol: "الاسم",
      ownBazaar: "سوق خاص",
      mealsCol: "وجبات",
      bazaarCostCol: "تكلفة السوق",
      currentStatus: "الحالة الحالية",
      bazaarList: "قائمة مصاريف السوق",
      descCol: "الوصف",
      amountCol: "المبلغ",
      utilityList: "قائمة فواتير المرافق",
      sectorCol: "القطاع / اسم الفاتورة",
      messUtilityBill: "فاتورة مرافق الفوضى",
      noBazaarCurrent: "لم يتم إضافة مصاريف سوق في الشهر الحالي.",
      noUtilityCurrent: "لم يتم إضافة فواتير مرافق منفصلة."
    }
  },
  hi: {
    sideMenuFixed: {
      pdfPopupAllow: "पीडीएफ जेनरेट करने के लिए कृपया पॉप-अप की अनुमति दें।",
      noBazaarAdded: "कोई बाज़ार खर्च नहीं जोड़ा गया।",
      noUtilityAdded: "कोई उपयोगिता बिल नहीं जोड़ा गया।",
      oldSessionReport: "पुराना सत्र मेस खाता रिपोर्ट",
      bazaarCostLbl: "बाज़ार लागत",
      totalUtilityCost: "कुल उपयोगिता लागत",
      grandTotal: "कुल योग",
      finalAccountMembers: "सदस्यों का अंतिम खाता",
      nameCol: "नाम",
      ownBazaar: "अपना बाज़ार",
      mealsCol: "भोजन",
      bazaarCostCol: "बाज़ार लागत",
      currentStatus: "वर्तमान स्थिति",
      bazaarList: "बाज़ार खर्च सूची",
      descCol: "विवरण",
      amountCol: "राशि",
      utilityList: "उपयोगिता बिल सूची",
      sectorCol: "क्षेत्र/बिल का नाम",
      messUtilityBill: "मेस उपयोगिता बिल",
      noBazaarCurrent: "चालू माह में कोई बाज़ार खर्च नहीं जोड़ा गया।",
      noUtilityCurrent: "कोई अलग उपयोगिता बिल नहीं जोड़ा गया।"
    }
  }
};

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(target[key], deepMerge(target[key], source[key]));
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

for (const lang of ['en', 'bn', 'ar', 'hi']) {
  trans[lang] = deepMerge(trans[lang], updates[lang]);
}

const newCode = `export type LanguageType = 'en' | 'bn' | 'ar' | 'hi';\n\nexport const translations: Record<LanguageType, any> = ${JSON.stringify(trans, null, 2)};\n`;
fs.writeFileSync('src/i18n/translations.ts', newCode);
