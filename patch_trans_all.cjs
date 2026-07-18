const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

const membersEN = `    members: {
      "addMemberTitle": "Add New Member",
      "memberNamePlaceholder": "Member Name (e.g., Zitu, Sagor)",
      "addMemberBtn": "Add Member",
      "memberListTitle": "Mess Members List",
      "peopleCount": "people",
      "registeredUsers": "Registered Users",
      "noMembersFound": "No members found!",
      "firstMemberPrompt": "Enter a name above to add the first member.",
      "lowBalance": "Balance empty! Payment due"
    },`;

const membersBN = `    members: {
      "addMemberTitle": "নতুন সদস্য যোগ করুন",
      "memberNamePlaceholder": "সদস্যের নাম (যেমন: Zitu, Shahadat, Sagor)",
      "addMemberBtn": "সদস্য যোগ করুন",
      "memberListTitle": "মেস সদস্য তালিকা",
      "peopleCount": "জন",
      "registeredUsers": "নিবন্ধিত ব্যবহারকারী",
      "noMembersFound": "কোনো সদস্য পাওয়া যায়নি!",
      "firstMemberPrompt": "উপরে নাম দিয়ে প্রথম মেস মেম্বার যুক্ত করুন।",
      "lowBalance": "জমা টাকা শেষ! ব্যালেন্স বকেয়া"
    },`;

const membersAR = `    members: {
      "addMemberTitle": "إضافة عضو جديد",
      "memberNamePlaceholder": "اسم العضو (مثل: زيتو، ساجور)",
      "addMemberBtn": "إضافة عضو",
      "memberListTitle": "قائمة أعضاء الفوضى",
      "peopleCount": "شخص",
      "registeredUsers": "المستخدمون المسجلون",
      "noMembersFound": "لم يتم العثور على أعضاء!",
      "firstMemberPrompt": "أدخل اسمًا أعلاه لإضافة العضو الأول.",
      "lowBalance": "الرصيد فارغ! الدفع مستحق"
    },`;

const membersHI = `    members: {
      "addMemberTitle": "नया सदस्य जोड़ें",
      "memberNamePlaceholder": "सदस्य का नाम (जैसे: ज़ितु, सागर)",
      "addMemberBtn": "सदस्य जोड़ें",
      "memberListTitle": "मेस सदस्य सूची",
      "peopleCount": "लोग",
      "registeredUsers": "पंजीकृत उपयोगकर्ता",
      "noMembersFound": "कोई सदस्य नहीं मिला!",
      "firstMemberPrompt": "पहला सदस्य जोड़ने के लिए ऊपर नाम दर्ज करें।",
      "lowBalance": "शेष राशि खाली! भुगतान देय"
    },`;

const mealsEN = `    meals: {
      "noMealsSet": "Fixed meals not set yet!",
      "noMealsDesc": "No fixed double or single meal rate has been determined for this month. Set fixed meals for accurate calculations.",
      "configuredTitle": "Fixed meals configured successfully",
      "configuredDesc1": "The current fixed monthly meal count for each member is ",
      "configuredDesc2": "meals",
      "setMealsTitle": "Set Fixed Meals",
      "setMealsDesc": "The set meal count will be equally applied to all active members in the current mess session.",
      "totalMeals": "Total Meals Count",
      "mealRateLabel": "Meal Count (Total or Daily Avg)",
      "updateMealsBtn": "Update & Save Meals",
      "successSave": "Saved successfully!",
      "memberMeals": "Members Meal Details",
      "mealCostDesc": "Each member's individual meal cost is displayed here based on the fixed meal rate.",
      "individualTotal": "Total: "
    },`;

const mealsBN = `    meals: {
      "noMealsSet": "নির্ধারিত মিল এখনো সেট করা হয়নি!",
      "noMealsDesc": "এই মাসের জন্য কোনো নির্দিষ্ট ডাবল বা সিঙ্গেল মিল রেট নির্ধারণ করা হয়নি। সঠি হিসাব নিকাশের জন্য নির্ধারিত মিল যোগ করুন।",
      "configuredTitle": "নির্ধারিত মিল অত্যন্ত সফলভাবে সেট আছে",
      "configuredDesc1": "প্রতিটি মেম্বারের বর্তমান নির্ধারিত মাসিক মিল সংখ্যা হচ্ছে ",
      "configuredDesc2": "টি",
      "setMealsTitle": "নির্ধারিত মিল সেট করুন",
      "setMealsDesc": "নির্ধারণকৃত মিল সংখ্যা চলমান মেস সেশনের অন্তর্ভুক্ত সকল সক্রিয় মেম্বারদের জন্য সমানভাবে কার্যকর করা হবে।",
      "totalMeals": "মোট মিল সংখ্যা",
      "mealRateLabel": "মিল সংখ্যা (টোটাল বা দৈনিক গড়)",
      "updateMealsBtn": "সেভ ও আপডেট করুন",
      "successSave": "সফলভাবে সেভ হয়েছে!",
      "memberMeals": "সদস্যদের মিল তালিকা",
      "mealCostDesc": "প্রতিটি মেম্বারের ব্যক্তিগত মোট মিল খরচ এখানে দেখানো হচ্ছে।",
      "individualTotal": "মোট: "
    },`;

const mealsAR = `    meals: {
      "noMealsSet": "لم يتم تعيين الوجبات الثابتة بعد!",
      "noMealsDesc": "لم يتم تحديد معدل وجبة مزدوجة أو مفردة ثابت لهذا الشهر. قم بتعيين وجبات ثابتة للحسابات الدقيقة.",
      "configuredTitle": "تم تكوين الوجبات الثابتة بنجاح",
      "configuredDesc1": "عدد الوجبات الشهرية الثابتة الحالية لكل عضو هو ",
      "configuredDesc2": "وجبات",
      "setMealsTitle": "تعيين الوجبات الثابتة",
      "setMealsDesc": "سيتم تطبيق عدد الوجبات المحدد بالتساوي على جميع الأعضاء النشطين في جلسة الفوضى الحالية.",
      "totalMeals": "إجمالي عدد الوجبات",
      "mealRateLabel": "عدد الوجبات (الإجمالي أو المتوسط اليومي)",
      "updateMealsBtn": "تحديث وحفظ الوجبات",
      "successSave": "تم الحفظ بنجاح!",
      "memberMeals": "تفاصيل وجبة الأعضاء",
      "mealCostDesc": "يتم عرض تكلفة الوجبة الفردية لكل عضو هنا بناءً على معدل الوجبة الثابتة.",
      "individualTotal": "المجموع: "
    },`;

const mealsHI = `    meals: {
      "noMealsSet": "निश्चित भोजन अभी तक सेट नहीं किया गया है!",
      "noMealsDesc": "इस महीने के लिए कोई निश्चित डबल या सिंगल भोजन दर निर्धारित नहीं की गई है। सटीक गणना के लिए निश्चित भोजन सेट करें।",
      "configuredTitle": "निश्चित भोजन सफलतापूर्वक कॉन्फ़िगर किया गया",
      "configuredDesc1": "प्रत्येक सदस्य के लिए वर्तमान निश्चित मासिक भोजन संख्या है ",
      "configuredDesc2": "भोजन",
      "setMealsTitle": "निश्चित भोजन सेट करें",
      "setMealsDesc": "सेट भोजन संख्या वर्तमान मेस सत्र में सभी सक्रिय सदस्यों पर समान रूप से लागू की जाएगी।",
      "totalMeals": "कुल भोजन संख्या",
      "mealRateLabel": "भोजन संख्या (कुल या दैनिक औसत)",
      "updateMealsBtn": "भोजन अपडेट और सहेजें",
      "successSave": "सफलतापूर्वक सहेजा गया!",
      "memberMeals": "सदस्यों का भोजन विवरण",
      "mealCostDesc": "निश्चित भोजन दर के आधार पर प्रत्येक सदस्य का व्यक्तिगत भोजन व्यय यहां प्रदर्शित किया जाता है।",
      "individualTotal": "कुल: "
    },`;

const expensesEN = `    expenses: {
      "addDailyBazaar": "Add Daily Bazaar",
      "selectDate": "Select Date",
      "amountAmount": "Amount (৳)",
      "selectBazaarMember": "Select Shopper",
      "bazaarDetailsOptional": "Shopping Details (Optional)",
      "addExpenseBtn": "Add Expense",
      "totalBazaarExpense": "Total Bazaar Expense",
      "otherUtilityBills": "Other & Utility Bills",
      "totalUtilityExpense": "Total Utility Bills",
      "addUtilityBill": "Add Utility Bill",
      "billTypeLabel": "Bill Name/Type",
      "addBillBtn": "Add Bill",
      "amount": "Amount",
      "expenseDescPlaceholder": "e.g., Rice, Dal, Onion...",
      "recentBazaar": "Recent Bazaar History",
      "noExpenses": "No expenses added yet.",
      "utilPlaceholder": "e.g., Gas bill, Wifi, Maid",
      "deletePrompt": "Delete this record?",
      "deleteConfirm": "Are you sure you want to delete this expense?",
      "voiceTooltip": "Hold to speak: \\"Sagor 500 taka\\"",
      "listening": "Listening...",
      "noMembers": "No members",
      "selectMember": "Select Member"
    },`;

const expensesBN = `    expenses: {
      "addDailyBazaar": "দৈনিক বাজার যোগ করুন",
      "selectDate": "তারিখ নির্বাচন করুন",
      "amountAmount": "টাকার পরিমাণ (৳)",
      "selectBazaarMember": "বাজারকারী নির্বাচন করুন",
      "bazaarDetailsOptional": "বাজার বিবরণ (ঐচ্ছিক)",
      "addExpenseBtn": "খরচ যোগ করুন",
      "totalBazaarExpense": "মোট বাজার খরচ",
      "otherUtilityBills": "অন্যান্য ও ইউটিলিটি বিল",
      "totalUtilityExpense": "মোট ইউটিলিটি খরচ",
      "addUtilityBill": "নতুন ইউটিলিটি বিল যোগ করুন",
      "billTypeLabel": "বিলের ধরন / নাম",
      "addBillBtn": "বিল যোগ করুন",
      "amount": "পরিমাণ",
      "expenseDescPlaceholder": "যেমন: চাল, ডাল, আলু, পেঁয়াজ...",
      "recentBazaar": "সাম্প্রতিক বাজারের তালিকা",
      "noExpenses": "কোনো বাজার খরচ যোগ করা হয়নি।",
      "utilPlaceholder": "যেমন: বুয়ার বিল, গ্যাস বিল, ওয়াইফাই",
      "deletePrompt": "এই রেকর্ড মুছতে চান?",
      "deleteConfirm": "আপনি কি নিশ্চিত যে আপনি এই খরচ মুছতে চান?",
      "voiceTooltip": "ভয়েস ইনপুট (যেমন: সাগর ৫০০ টাকা)",
      "listening": "শুনছি...",
      "noMembers": "মেম্বার নেই",
      "selectMember": "মেম্বার নির্বাচন করুন"
    },`;

const expensesAR = `    expenses: {
      "addDailyBazaar": "إضافة سوق يومي",
      "selectDate": "حدد تاريخ",
      "amountAmount": "المبلغ (৳)",
      "selectBazaarMember": "حدد المتسوق",
      "bazaarDetailsOptional": "تفاصيل التسوق (اختياري)",
      "addExpenseBtn": "إضافة المصاريف",
      "totalBazaarExpense": "إجمالي مصاريف السوق",
      "otherUtilityBills": "الفواتير الأخرى والمرافق",
      "totalUtilityExpense": "إجمالي فواتير المرافق",
      "addUtilityBill": "إضافة فاتورة مرافق",
      "billTypeLabel": "اسم/نوع الفاتورة",
      "addBillBtn": "إضافة فاتورة",
      "amount": "المبلغ",
      "expenseDescPlaceholder": "مثل، الأرز، العدس، البصل...",
      "recentBazaar": "تاريخ السوق الأخير",
      "noExpenses": "لم يتم إضافة أي مصاريف بعد.",
      "utilPlaceholder": "مثل فاتورة الغاز، الواي فاي، الخادمة",
      "deletePrompt": "حذف هذا السجل؟",
      "deleteConfirm": "هل أنت متأكد أنك تريد حذف هذه النفقات؟",
      "voiceTooltip": "اضغط للتحدث",
      "listening": "استماع...",
      "noMembers": "لا يوجد أعضاء",
      "selectMember": "حدد العضو"
    },`;

const expensesHI = `    expenses: {
      "addDailyBazaar": "दैनिक बाजार जोड़ें",
      "selectDate": "तारीख चुनें",
      "amountAmount": "राशि (৳)",
      "selectBazaarMember": "खरीदार चुनें",
      "bazaarDetailsOptional": "खरीदारी विवरण (वैकल्पिक)",
      "addExpenseBtn": "व्यय जोड़ें",
      "totalBazaarExpense": "कुल बाजार व्यय",
      "otherUtilityBills": "अन्य और उपयोगिता बिल",
      "totalUtilityExpense": "कुल उपयोगिता बिल",
      "addUtilityBill": "उपयोगिता बिल जोड़ें",
      "billTypeLabel": "बिल का नाम/प्रकार",
      "addBillBtn": "बिल जोड़ें",
      "amount": "राशि",
      "expenseDescPlaceholder": "जैसे, चावल, दाल, प्याज...",
      "recentBazaar": "हाल का बाजार इतिहास",
      "noExpenses": "अभी तक कोई खर्च नहीं जोड़ा गया है।",
      "utilPlaceholder": "जैसे गैस बिल, वाईफाई, नौकरानी",
      "deletePrompt": "इस रिकॉर्ड को हटा दें?",
      "deleteConfirm": "क्या आप वाकई इस खर्च को हटाना चाहते हैं?",
      "voiceTooltip": "बोलने के लिए दबाएं",
      "listening": "सुन रहा हूँ...",
      "noMembers": "कोई सदस्य नहीं",
      "selectMember": "सदस्य चुनें"
    },`;

const depositsEN = `    deposits: {
      "addDepositTitle": "Add New Deposit",
      "selectMember": "Select Member",
      "amountLabel": "Deposit Amount (৳)",
      "dateLabelOptional": "Date (Optional)",
      "depositBtn": "Submit Deposit",
      "totalDepositsTitle": "Total Mess Deposits",
      "depositHistoryTitle": "Deposit History",
      "noDepositsYet": "No deposit history yet.",
      "recentTxs": "Recent Transactions",
      "selectMemberPrompt": "Select Member",
      "noMembersAvailable": "No members available"
    },`;

const depositsBN = `    deposits: {
      "addDepositTitle": "নতুন জমা যোগ করুন",
      "selectMember": "সদস্য নির্বাচন করুন",
      "amountLabel": "জমা পরিমাণ (৳)",
      "dateLabelOptional": "তারিখ (ঐচ্ছিক)",
      "depositBtn": "টাকা জমা দিন",
      "totalDepositsTitle": "মোট জমা",
      "depositHistoryTitle": "জমার ইতিহাস",
      "noDepositsYet": "কোনো জমা ইতিহাস নেই।",
      "recentTxs": "সাম্প্রতিক লেনদেন",
      "selectMemberPrompt": "সদস্য নির্বাচন করুন",
      "noMembersAvailable": "সদস্য নেই"
    },`;

const depositsAR = `    deposits: {
      "addDepositTitle": "إضافة وديعة جديدة",
      "selectMember": "حدد العضو",
      "amountLabel": "مبلغ الوديعة (৳)",
      "dateLabelOptional": "التاريخ (اختياري)",
      "depositBtn": "إرسال الوديعة",
      "totalDepositsTitle": "إجمالي ودائع الفوضى",
      "depositHistoryTitle": "تاريخ الإيداع",
      "noDepositsYet": "لا يوجد تاريخ إيداع بعد.",
      "recentTxs": "المعاملات الأخيرة",
      "selectMemberPrompt": "حدد العضو",
      "noMembersAvailable": "لا يتوفر أعضاء"
    },`;

const depositsHI = `    deposits: {
      "addDepositTitle": "नई जमा राशि जोड़ें",
      "selectMember": "सदस्य चुनें",
      "amountLabel": "जमा राशि (৳)",
      "dateLabelOptional": "तारीख (वैकल्पिक)",
      "depositBtn": "जमा जमा करें",
      "totalDepositsTitle": "कुल मेस जमा",
      "depositHistoryTitle": "जमा इतिहास",
      "noDepositsYet": "अभी तक कोई जमा इतिहास नहीं है।",
      "recentTxs": "हाल के लेनदेन",
      "selectMemberPrompt": "सदस्य चुनें",
      "noMembersAvailable": "कोई सदस्य उपलब्ध नहीं"
    },`;

const bazaarEN = `    bazaar: {
      "addBazaarItem": "Add New Bazaar Item",
      "itemName": "Item Name (e.g. Rice, Oil)",
      "addBtn": "Add to List",
      "shoppingList": "Shopping List",
      "noItems": "No items in the list.",
      "completed": "Completed",
      "clearList": "Clear List",
      "dailyDuty": "Daily Shopping Duty",
      "selectDutyMember": "Select Member for Duty",
      "noDutySet": "No duty set",
      "assignDuty": "Assign Duty"
    },`;

const bazaarBN = `    bazaar: {
      "addBazaarItem": "নতুন বাজার তালিকা যোগ করুন",
      "itemName": "পণ্যের নাম (যেমন: চাল, ডাল)",
      "addBtn": "তালিকায় যোগ করুন",
      "shoppingList": "বাজার তালিকা",
      "noItems": "কোনো আইটেম নেই।",
      "completed": "সম্পন্ন",
      "clearList": "তালিকা মুছুন",
      "dailyDuty": "দৈনিক বাজার ডিউটি",
      "selectDutyMember": "ডিউটির জন্য সদস্য নির্বাচন করুন",
      "noDutySet": "ডিউটি সেট করা নেই",
      "assignDuty": "ডিউটি দিন"
    },`;

const bazaarAR = `    bazaar: {
      "addBazaarItem": "إضافة عنصر تسوق جديد",
      "itemName": "اسم العنصر (مثل الأرز والزيت)",
      "addBtn": "أضف إلى القائمة",
      "shoppingList": "قائمة التسوق",
      "noItems": "لا توجد عناصر في القائمة.",
      "completed": "مكتمل",
      "clearList": "مسح القائمة",
      "dailyDuty": "واجب التسوق اليومي",
      "selectDutyMember": "اختر عضو للواجب",
      "noDutySet": "لم يتم تحديد الواجب",
      "assignDuty": "تعيين الواجب"
    },`;

const bazaarHI = `    bazaar: {
      "addBazaarItem": "नया बाज़ार आइटम जोड़ें",
      "itemName": "आइटम का नाम (जैसे चावल, तेल)",
      "addBtn": "सूची में जोड़ें",
      "shoppingList": "खरीदारी की सूची",
      "noItems": "सूची में कोई आइटम नहीं।",
      "completed": "पूरा हुआ",
      "clearList": "सूची साफ़ करें",
      "dailyDuty": "दैनिक खरीदारी ड्यूटी",
      "selectDutyMember": "ड्यूटी के लिए सदस्य चुनें",
      "noDutySet": "कोई ड्यूटी सेट नहीं",
      "assignDuty": "ड्यूटी सौंपें"
    },`;


const insertTranslations = (lang, newStr) => {
  const target = `  ${lang}: {`;
  code = code.replace(target, target + '\n' + newStr);
};

insertTranslations('en', membersEN + '\n' + mealsEN + '\n' + expensesEN + '\n' + depositsEN + '\n' + bazaarEN);
insertTranslations('bn', membersBN + '\n' + mealsBN + '\n' + expensesBN + '\n' + depositsBN + '\n' + bazaarBN);
insertTranslations('ar', membersAR + '\n' + mealsAR + '\n' + expensesAR + '\n' + depositsAR + '\n' + bazaarAR);
insertTranslations('hi', membersHI + '\n' + mealsHI + '\n' + expensesHI + '\n' + depositsHI + '\n' + bazaarHI);

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Component translations added to dict");
