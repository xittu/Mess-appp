const fs = require('fs');

let oldCode = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = oldCode.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const trans = JSON.parse(objStr);

const updates = {
  hi: {
    expenses: {
      totalBazaarExpense: 'कुल बाज़ार खर्च',
      otherUtilityBills: 'अन्य और उपयोगिता बिल',
      addDailyBazaar: 'दैनिक बाज़ार जोड़ें',
      voiceInput: 'वॉयस एंट्री',
      selectDate: 'तारीख चुनें',
      amountAmount: 'रकम (৳)',
      selectBuyer: 'खरीदार चुनें (किसने खर्च किया?)',
      bazaarDetailsOptional: 'खरीदारी विवरण (वैकल्पिक)',
      itemDescPlaceholder: 'जैसे, आलू, दाल, चिकन...',
      voiceListening: 'सुन रहा है...',
    },
    bazaar: {
      weeklyDuty: 'साप्ताहिक बाज़ार ड्यूटी',
      noDuty: "कोई ड्यूटी सेट नहीं है। 'More' मेनू से रूटीन सेट करें।",
      sharedList: 'साझा बाज़ार सूची',
      newItem: 'नया बाज़ार आइटम...',
      emptyList: 'सूची खाली है।'
    },
    sideMenuFixed: {
      dutySchedule: 'मेस ड्यूटी शेड्यूल',
      dutyScheduleDesc: 'जिम्मेदारियों की दिनचर्या (बाज़ार, भोजन प्रबंधक, क्लीनर)'
    },
    meals: {
      activeCount: 'सक्रिय',
      totalMealsOrAvg: 'भोजन संख्या (कुल या दैनिक औसत)',
      totalMealsCount: 'कुल भोजन संख्या',
      setFixedMealsBtn: 'भोजन निर्धारित करें',
      membersMealOverview: 'सदस्यों का भोजन अवलोकन',
      mealCountLabel: 'भोजन गणना:',
    },
    meals2: {
        activeMembers: "सक्रिय",
        setFixedMealsBtn: "भोजन निर्धारित करें",
        mealCountLabel: "भोजन गणना:",
        membersMealOverview: "सदस्यों का भोजन अवलोकन",
        mealCalcLabel: "भोजन गणना",
        mealCalcDesc: "व्यक्तिगत या दैनिक परिवर्तनों के लिए कॉन्फ़िगर किए गए भोजन के बजाय अपने मेस के लिए कुल भोजन या कस्टम सीमा निर्धारित करें। यह प्रणाली सरल और आसान गणना के लिए डिज़ाइन की गई है।"
    },
    expensesTab: {
      commonFund: 'सामान्य / मेस फंड (किसी ने व्यक्तिगत रूप से भुगतान नहीं किया)',
      utilityBillsTitle: 'उपयोगिता और अन्य बिल (बिजली, पानी, आदि)',
      addOtherBill: 'अन्य बिल जोड़ें',
      bazaarRecords: 'बाज़ार खर्च रिकॉर्ड',
      itemDescPlaceholder: 'जैसे, आलू, दाल, चिकन...',
      utilityDescPlaceholder: '...बिजली बिल, पानी बिल',
      billAmount: 'बिल राशि'
    }
  },
  bn: {
    expenses: {
      totalBazaarExpense: 'মোট বাজার খরচ',
      otherUtilityBills: 'অন্যান্য এবং ইউটিলিটি বিল',
      addDailyBazaar: 'দৈনিক বাজার যোগ করুন',
      voiceInput: 'ভয়েস এন্ট্রি',
      selectDate: 'তারিখ নির্বাচন',
      amountAmount: 'পরিমাণ (৳)',
      selectBuyer: 'ক্রেতা নির্বাচন করুন (কে খরচ করেছে?)',
      bazaarDetailsOptional: 'বাজারের বিবরণ (ঐচ্ছিক)',
      itemDescPlaceholder: 'যেমন: আলু, ডাল, মুরগি...',
      voiceListening: 'শুনছি...',
    },
    bazaar: {
      weeklyDuty: 'সাপ্তাহিক বাজার ডিউটি',
      noDuty: "কোন ডিউটি সেট করা নেই। 'More' মেনু থেকে রুটিন সেট করুন।",
      sharedList: 'শেয়ার্ড বাজার তালিকা',
      newItem: 'নতুন বাজার আইটেম...',
      emptyList: 'তালিকাটি খালি।'
    },
    sideMenuFixed: {
      dutySchedule: 'মেস ডিউটি রুটিন (Mess Duty Schedule)',
      dutyScheduleDesc: 'কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার রুটিন'
    },
    meals2: {
        activeMembers: "সক্রিয়",
        setFixedMealsBtn: "ফিক্সড মিল সেট করুন",
        mealCountLabel: "মিল হিসাব:",
        membersMealOverview: "সদস্যদের মিল ওভারভিউ",
        mealCalcLabel: "মিল হিসাব",
        mealCalcDesc: "ব্যক্তিগত বা দৈনিক মিল কম-বেশি পরিবর্তনের জন্য নির্ধারিত মিলের জায়গায় আপনার মেসের মোট মিল বা কাস্টম লিমিট সেট করে নিন। এই সিস্টেমটি সহজ ও সরল গণনার জন্য ডিজাইন করা হয়েছে।"
    },
    expensesTab: {
      commonFund: 'কমন / মেস ফান্ড (ব্যক্তিগতভাবে কেউ দেয়নি)',
      utilityBillsTitle: 'ইউটিলিটি ও অন্যান্য বিল (বিদ্যুৎ, পানি ইত্যাদি)',
      addOtherBill: 'অন্যান্য বিল যোগ করুন',
      bazaarRecords: 'বাজার খরচের রেকর্ডস',
      itemDescPlaceholder: 'যেমন: আলু, ডাল, মুরগি...',
      utilityDescPlaceholder: '...বিদ্যুৎ বিল, পানি বিল',
      billAmount: 'বিলের পরিমাণ'
    }
  },
  ar: {
    expenses: {
      totalBazaarExpense: 'إجمالي مصاريف السوق',
      otherUtilityBills: 'فواتير المرافق الأخرى',
      addDailyBazaar: 'إضافة سوق يومي',
      voiceInput: 'إدخال صوتي',
      selectDate: 'تحديد التاريخ',
      amountAmount: 'المبلغ (৳)',
      selectBuyer: 'تحديد المشتري (من أنفق؟)',
      bazaarDetailsOptional: 'تفاصيل التسوق (اختياري)',
      itemDescPlaceholder: 'مثال: بطاطس، عدس، دجاج...',
      voiceListening: 'يستمع...',
    },
    bazaar: {
      weeklyDuty: 'واجب السوق الأسبوعي',
      noDuty: "لم يتم تعيين واجب. قم بتعيين الروتين من قائمة 'المزيد'.",
      sharedList: 'قائمة السوق المشتركة',
      newItem: 'عنصر سوق جديد...',
      emptyList: 'القائمة فارغة.'
    },
    sideMenuFixed: {
      dutySchedule: 'جدول واجبات الفوضى',
      dutyScheduleDesc: 'روتين المسؤوليات (السوق، مدير الوجبات، المنظف)'
    },
    meals2: {
        activeMembers: "نشط",
        setFixedMealsBtn: "تعيين وجبات ثابتة",
        mealCountLabel: "عدد الوجبات:",
        membersMealOverview: "نظرة عامة على وجبات الأعضاء",
        mealCalcLabel: "حساب الوجبة",
        mealCalcDesc: "قم بتعيين إجمالي الوجبات أو الحد المخصص للفوضى بدلاً من الوجبات المحددة للتغييرات الفردية أو اليومية. تم تصميم هذا النظام للحساب البسيط."
    },
    expensesTab: {
      commonFund: 'صندوق مشترك / فوضى (لم يدفع أحد بشكل فردي)',
      utilityBillsTitle: 'فواتير المرافق وغيرها (الكهرباء والماء، إلخ.)',
      addOtherBill: 'إضافة فاتورة أخرى',
      bazaarRecords: 'سجلات مصاريف السوق',
      itemDescPlaceholder: 'مثال: بطاطس، عدس، دجاج...',
      utilityDescPlaceholder: '...فاتورة الكهرباء، فاتورة الماء',
      billAmount: 'مبلغ الفاتورة'
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

for (const lang of ['hi', 'bn', 'ar']) {
  trans[lang] = deepMerge(trans[lang], updates[lang]);
}

const newCode = `export type LanguageType = 'en' | 'bn' | 'ar' | 'hi';\n\nexport const translations: Record<LanguageType, any> = ${JSON.stringify(trans, null, 2)};\n`;
fs.writeFileSync('src/i18n/translations.ts', newCode);
