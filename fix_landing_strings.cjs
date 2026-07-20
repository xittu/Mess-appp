const fs = require('fs');

let oldCode = fs.readFileSync('src/i18n/translations.ts', 'utf8');
const objStr = oldCode.replace(/export type LanguageType = 'en' \| 'bn' \| 'ar' \| 'hi';\n\nexport const translations: Record<LanguageType, any> = /, '').replace(/;\n$/, '');
const trans = JSON.parse(objStr);

const updates = {
  en: {
    landingPage: {
      login: "Login",
      signUp: "Sign Up",
      smartSystem: "Smart Mess Management System",
      desc1: "Dormz is an advanced and intuitive mess management application designed to make daily accounting hassle-free for bachelors and people living in messes.",
      desc2: "The days of keeping accounts on pen and paper are over! Now you can easily track your mess meals, bazaar expenses, utility bills, and deposits in real-time from your smartphone or PC. The app automatically calculates individual deposits, expenses, and dues or balances at the end of the month.",
      desc3: "There is also a duty roster system, through which weekly bazaar and other responsibilities can be distributed among members. With data backup and cloud sync features, your mess accounts will never be lost.",
      getStarted: "Get Started",
      loginBtn: "Login to Account",
      createAccount: "Create New Account",
      learnMore: "Learn More",
      appDetailsTitle: "App Details",
      memberManagementTitle: "Member Management",
      memberManagementDesc: "Easily keep real-time track of all mess members' info, deposits, and dues.",
      mealTrackingTitle: "Meal Tracking",
      mealTrackingDesc: "Automatically calculate each member's monthly cost based on the fixed meal rate.",
      dailyExpensesTitle: "Daily Expenses",
      dailyExpensesDesc: "Keep a transparent record of daily bazaar and utility bills in the cloud.",
      dutyRosterTitle: "Duty Roster",
      dutyRosterDesc: "An easy way to assign and track weekly bazaar duties among members.",
      securedCloudTitle: "Secured Cloud",
      securedCloudDesc: "Keep all your mess data secure for free with offline support.",
      automatedBalanceTitle: "Automated Balance",
      automatedBalanceDesc: "Know instantly who owes how much or has dues with just one click.",
      termsConditions: "Terms and Conditions",
      allRightsReserved: "All Rights Reserved."
    }
  },
  bn: {
    landingPage: {
      login: "লগইন",
      signUp: "সাইন আপ",
      smartSystem: "স্মার্ট মেস ম্যানেজমেন্ট সিস্টেম",
      desc1: "Dormz (ডর্মস) হলো একটি অত্যাধুনিক এবং সহজবোধ্য মেস ম্যানেজমেন্ট অ্যাপ্লিকেশন যা তৈরি করা হয়েছে ব্যাচেলর এবং মেসে বসবাসরত মানুষদের দৈনন্দিন হিসাব-নিকাশকে ঝামেলামুক্ত করার জন্য।",
      desc2: "খাতা-কলমে হিসাব রাখার দিন শেষ! এখন আপনি খুব সহজেই আপনার স্মার্টফোন বা পিসি থেকে মেসের মিল (Meals), বাজার খরচ (Bazaar Expenses), ইউটিলিটি বিল (Utility Bills), এবং সদস্যদের টাকা জমার (Deposits) হিসাব রিয়েল-টাইমে ট্র্যাক করতে পারবেন। অ্যাপটি স্বয়ংক্রিয়ভাবে কার কত টাকা ব্যক্তিগত জমা আছে, কে কত টাকা খরচ করেছে এবং মাস শেষে কার দেনা বা পাওনা কত—তা মুহূর্তের মধ্যে হিসাব করে দেয়।",
      desc3: "এছাড়া রয়েছে ডিউটি রোস্টার সিস্টেম, যার মাধ্যমে প্রতি সপ্তাহের বাজার এবং অন্যান্য কাজের দায়িত্ব সদস্যদের মাঝে বণ্টন করা যায়। ডেটা ব্যাকআপ ও ক্লাউড সিঙ্ক সুবিধায় আপনার মেসের হিসাব কখনোই হারাবে না।",
      getStarted: "শুরু করুন",
      loginBtn: "লগইন করুন",
      createAccount: "নতুন একাউন্ট খুলুন",
      learnMore: "আরও জানুন",
      appDetailsTitle: "অ্যাপ সম্পর্কে বিস্তারিত",
      memberManagementTitle: "সদস্য ব্যবস্থাপনা",
      memberManagementDesc: "মেসের সকল সদস্যের তথ্য, জমা ও বকেয়ার রিয়েল-টাইম হিসাব রাখুন খুব সহজেই।",
      mealTrackingTitle: "মিল ট্র্যাকিং",
      mealTrackingDesc: "নির্ধারিত মিল রেট অনুযায়ী স্বয়ংক্রিয়ভাবে প্রতি সদস্যের মাসিক খরচ হিসাব করুন।",
      dailyExpensesTitle: "দৈনন্দিন খরচ",
      dailyExpensesDesc: "প্রতিদিনের বাজার ও ইউটিলিটি বিলের স্বচ্ছ হিসাব সংরক্ষণ করুন ক্লাউডে।",
      dutyRosterTitle: "ডিউটি রোস্টার",
      dutyRosterDesc: "সদস্যদের সাপ্তাহিক বাজারের দায়িত্ব নির্ধারণ ও ট্র্যাক করার সহজ মাধ্যম।",
      securedCloudTitle: "সিকিউরড ক্লাউড",
      securedCloudDesc: "বিনা মূল্যে আপনার মেসের সমস্ত ডেটা সুরক্ষিত রাখুন অফলাইন সাপোর্টের সাথে।",
      automatedBalanceTitle: "অটোমেটেড ব্যালেন্স",
      automatedBalanceDesc: "কার কত টাকা পাওনা বা দেনা আছে তা এক ক্লিকে জেনে নিন যেকোনো সময়।",
      termsConditions: "শর্তাবলী (Terms and Conditions)",
      allRightsReserved: "অল রাইটস রিজার্ভড।"
    }
  },
  ar: {
    landingPage: {
      login: "تسجيل الدخول",
      signUp: "اشتراك",
      smartSystem: "نظام إدارة الفوضى الذكي",
      desc1: "Dormz هو تطبيق متقدم وسهل الاستخدام لإدارة الفوضى مصمم لجعل الحسابات اليومية خالية من المتاعب للعزاب والأشخاص الذين يعيشون في فوضى.",
      desc2: "لقد ولت أيام تتبع الحسابات بالقلم والورقة! يمكنك الآن بسهولة تتبع وجبات الفوضى ونفقات السوق وفواتير الخدمات والودائع في الوقت الفعلي من هاتفك الذكي أو جهاز الكمبيوتر الخاص بك. يقوم التطبيق تلقائيًا بحساب الودائع الفردية والنفقات والمستحقات أو الأرصدة في نهاية الشهر.",
      desc3: "يوجد أيضًا نظام قائمة المهام ، والذي من خلاله يمكن توزيع السوق الأسبوعي والمسؤوليات الأخرى بين الأعضاء. مع النسخ الاحتياطي للبيانات وميزات المزامنة السحابية ، لن تضيع حسابات الفوضى الخاصة بك أبدًا.",
      getStarted: "البدء",
      loginBtn: "تسجيل الدخول إلى الحساب",
      createAccount: "إنشاء حساب جديد",
      learnMore: "يتعلم أكثر",
      appDetailsTitle: "تفاصيل التطبيق",
      memberManagementTitle: "إدارة الأعضاء",
      memberManagementDesc: "تتبع معلومات جميع أعضاء الفوضى والودائع والمستحقات في الوقت الفعلي بسهولة.",
      mealTrackingTitle: "تتبع الوجبة",
      mealTrackingDesc: "حساب التكلفة الشهرية لكل عضو تلقائيًا بناءً على معدل الوجبة الثابت.",
      dailyExpensesTitle: "النفقات اليومية",
      dailyExpensesDesc: "احتفظ بسجل شفاف للسوق اليومي وفواتير الخدمات في السحابة.",
      dutyRosterTitle: "قائمة المهام",
      dutyRosterDesc: "طريقة سهلة لتعيين وتتبع واجبات السوق الأسبوعية بين الأعضاء.",
      securedCloudTitle: "سحابة آمنة",
      securedCloudDesc: "حافظ على أمان جميع بيانات الفوضى الخاصة بك مجانًا مع دعم عدم الاتصال بالإنترنت.",
      automatedBalanceTitle: "الرصيد الآلي",
      automatedBalanceDesc: "اعرف على الفور من يدين بكم أو لديه مستحقات بنقرة واحدة فقط.",
      termsConditions: "البنود و الظروف",
      allRightsReserved: "كل الحقوق محفوظة."
    }
  },
  hi: {
    landingPage: {
      login: "लॉग इन करें",
      signUp: "साइन अप करें",
      smartSystem: "स्मार्ट मेस मैनेजमेंट सिस्टम",
      desc1: "डॉर्म्ज़ (Dormz) एक उन्नत और सहज मेस प्रबंधन एप्लिकेशन है जिसे कुंवारे लोगों और मेस में रहने वाले लोगों के लिए दैनिक लेखांकन को परेशानी मुक्त बनाने के लिए डिज़ाइन किया गया है।",
      desc2: "पेन और पेपर पर अकाउंट रखने के दिन गए! अब आप अपने स्मार्टफोन या पीसी से आसानी से अपने मेस के भोजन, बाज़ार खर्च, उपयोगिता बिल और जमा को वास्तविक समय में ट्रैक कर सकते हैं। ऐप स्वचालित रूप से महीने के अंत में व्यक्तिगत जमा, खर्च और देय या शेष राशि की गणना करता है।",
      desc3: "एक ड्यूटी रोस्टर प्रणाली भी है, जिसके माध्यम से सदस्यों के बीच साप्ताहिक बाजार और अन्य जिम्मेदारियों को वितरित किया जा सकता है। डेटा बैकअप और क्लाउड सिंक सुविधाओं के साथ, आपके मेस खाते कभी नहीं खोएंगे।",
      getStarted: "शुरू करें",
      loginBtn: "अकाउंट में लॉगिन करें",
      createAccount: "नया खाता बनाएँ",
      learnMore: "और अधिक जानें",
      appDetailsTitle: "ऐप विवरण",
      memberManagementTitle: "सदस्य प्रबंधन",
      memberManagementDesc: "सभी मेस सदस्यों की जानकारी, जमा और बकाया का रीयल-टाइम ट्रैक आसानी से रखें।",
      mealTrackingTitle: "भोजन ट्रैकिंग",
      mealTrackingDesc: "निश्चित भोजन दर के आधार पर स्वचालित रूप से प्रत्येक सदस्य की मासिक लागत की गणना करें।",
      dailyExpensesTitle: "दैनिक खर्च",
      dailyExpensesDesc: "क्लाउड में दैनिक बाज़ार और उपयोगिता बिलों का पारदर्शी रिकॉर्ड रखें।",
      dutyRosterTitle: "ड्यूटी रोस्टर",
      dutyRosterDesc: "सदस्यों के बीच साप्ताहिक बाज़ार कर्तव्यों को सौंपने और ट्रैक करने का एक आसान तरीका।",
      securedCloudTitle: "सुरक्षित क्लाउड",
      securedCloudDesc: "ऑफ़लाइन समर्थन के साथ अपने सभी मेस डेटा को मुफ़्त में सुरक्षित रखें।",
      automatedBalanceTitle: "स्वचालित संतुलन",
      automatedBalanceDesc: "एक क्लिक में तुरंत जानें कि किसके पास कितना बकाया है या कितना देय है।",
      termsConditions: "नियम और शर्तें",
      allRightsReserved: "सभी अधिकार सुरक्षित।"
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
