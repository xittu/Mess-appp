const fs = require('fs');

let sideCode = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const mapSide = {
  'মেস ডিউটি রুটিন (Mess Duty Schedule)': '{t("sideMenuFixed.dutySchedule")}',
  'কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার': '',
  'রুটিন': '{t("sideMenuFixed.dutyScheduleDesc")}',
  'লগ আউট': '{t("sideMenuFixed.logout")}',
  'সকল মেস ডাটা রিসেট করুন': '{t("sideMenuFixed.resetAllData")}',
  'ডাটা রিসেট করার সতর্কতা!': '{t("sideMenuFixed.resetDataWarningTitle")}',
  'আপনি কি ডাটা রিসেট করতে চান? তাহলে কিন্তু আপনার মেসের সদস্যদের': '',
  'তথ্য, বিগত জমা এবং যাবতীয় খরচের সকল ডাটা চিরতরে কেটে যাবে এবং': '',
  'এটি আর পুনরুদ্ধার করা যাবে না।': '{t("sideMenuFixed.resetDataWarningDesc")}',
  'হ্যাঁ, সব ডিলিট করুন': '{t("sideMenuFixed.btnResetYes")}',
  'না, বাতিল করুন': '{t("sideMenuFixed.btnResetNo")}',
  'মোট বাজার': '{t("sideMenuFixed.totalBazaar")}',
  'মিল রেট': '{t("sideMenuFixed.mealRate")}',
  'ইউটিলিটি/মেম্বার': '{t("sideMenuFixed.utilityPerMember")}',
  'সদস্যদের ফাইল লেজার': '{t("sideMenuFixed.memberFileLedger")}',
  'সব হিসাব সহ প্রিন্ট কপি': '{t("sideMenuFixed.printCopyDesc")}',
  'পিডিএফ ডাউনলোড': '{t("sideMenuFixed.pdfDownload")}',
  'কোন মেম্বার রেকর্ড পাওয়া যায়নি!': '{t("sideMenuFixed.noMemberRecord")}',
  'title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"': 'title={t("sideMenuFixed.balanceDue")}',
  'ব্যালেন্স: ': '{t("sideMenuFixed.balance")}',
  'জমা': '{t("sideMenuFixed.deposit")}',
  'ব্রেড/বাজার': '{t("sideMenuFixed.bazaarSpent")}',
  'মিল খরচ': '{t("sideMenuFixed.mealCost")}',
  'ইউটিলিটি': '{t("sideMenuFixed.utilityCost")}',
  'মোট খরচ': '{t("sideMenuFixed.totalCost")}',
  'মেসের মিল রেট ফর্মুলা: ': '{t("sideMenuFixed.mealRateFormula")}',
  '<b>(মোট বাজার খরচ / মোট মিল সংখ্যা)</b>। ইউটিলিটি চার্জ': '<b>{t("sideMenuFixed.mealRateFormulaBold")}</b>',
  'যেমন বিদ্যুৎ ও পানি বিল সকল মেম্বারদের মাঝে সমান ভাগ করা': '',
  'হয়েছে।': '{t("sideMenuFixed.utilityChargeDesc")}',
  'নতুন ডিউটি শিডিউল যোগ করুন': '{t("sideMenuFixed.addNewDuty")}',
  'সপ্তাহের দিন': '{t("sideMenuFixed.dayOfWeek")}',
  'মেস সদস্য': '{t("sideMenuFixed.messMember")}',
  'কোনো সদস্য নেই': '{t("sideMenuFixed.noMembers")}',
  'দায়িত্বরত কাজ নির্বাচন করুন': '{t("sideMenuFixed.selectRole")}',
  'বাজার দায়িত্ব': '{t("sideMenuFixed.roleBazaar")}',
  'সাপ্তাহিক বাজার দায়িত্ব': '{t("sideMenuFixed.roleBazaarDesc")}',
  'রান্নার ডেট': '{t("sideMenuFixed.roleCooking")}',
  'মিল রান্না করার দায়িত্ব': '{t("sideMenuFixed.roleCookingDesc")}',
  'তালিকাভুক্ত করুন': '{t("sideMenuFixed.listDutyBtn")}',
  'সাপ্তাহিক মেস ডিউটি রুটিন (বাজার ও রান্নার ডেট)': '{t("sideMenuFixed.weeklyDutyRoutine")}',
  'কোনো সাপ্তাহিক ডিউটি শিডিউল সেট করা নেই।': '{t("sideMenuFixed.noWeeklyDuty")}',
  'title="ডিউটি মুছে ফেলুন"': 'title={t("sideMenuFixed.deleteDutyTitle")}',
  '© ২০২৬ মেস ডিজিটাল সিস্টেম - সর্বস্বত্ব সংরক্ষিত': '{t("sideMenuFixed.footerCopyright")}'
};

// We will do string replacement for the exact lines if we can, 
// or simply globally replace exact strings if they are unique enough.

for (let key in mapSide) {
  sideCode = sideCode.split(key).join(mapSide[key]);
}

// Fix some multi-line splits that left empty space
sideCode = sideCode.replace(/>\s*\{\s*t\("sideMenuFixed.dutyScheduleDesc"\)\s*\}\s*</g, '>{t("sideMenuFixed.dutyScheduleDesc")}<');
sideCode = sideCode.replace(/>\s*\{\s*t\("sideMenuFixed.resetDataWarningDesc"\)\s*\}\s*</g, '>{t("sideMenuFixed.resetDataWarningDesc")}<');
sideCode = sideCode.replace(/\{\s*t\("sideMenuFixed.utilityChargeDesc"\)\s*\}/g, '{t("sideMenuFixed.utilityChargeDesc")}');

// some cleanup
sideCode = sideCode.replace(/\{\s*t\("sideMenuFixed\.deposit"\)\s*\}/g, '{t("sideMenuFixed.deposit")}');

fs.writeFileSync('src/components/SideMenu.tsx', sideCode);
console.log("Patched SideMenu.tsx");
