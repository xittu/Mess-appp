const fs = require('fs');

let oldCode = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = oldCode.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const trans = JSON.parse(objStr);

const updates = {
  en: {
    meals: {
      mealSaved: "Meals saved successfully!",
      noMembers: "No members in the mess yet."
    }
  },
  bn: {
    meals: {
      mealSaved: "মিল সেভ করা হয়েছে!",
      noMembers: "মেসে এখনো কোনো সদস্য নেই।"
    }
  },
  ar: {
    meals: {
      mealSaved: "تم حفظ الوجبات بنجاح!",
      noMembers: "لا يوجد أعضاء في الفوضى بعد."
    }
  },
  hi: {
    meals: {
      mealSaved: "भोजन सफलतापूर्वक सहेजा गया!",
      noMembers: "मेस में अभी तक कोई सदस्य नहीं है।"
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
