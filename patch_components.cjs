const fs = require('fs');

function replaceAll(str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join("|"), "g");
  return str.replace(re, function(matched){
    return mapObj[matched];
  });
}

let pwdCode = fs.readFileSync('src/components/PasswordChangeModal.tsx', 'utf8');

// I need to add useLanguage
if (!pwdCode.includes('useLanguage')) {
  pwdCode = pwdCode.replace(/import React.*?;\n/g, match => match + 'import { useLanguage } from "../contexts/LanguageContext";\n');
  pwdCode = pwdCode.replace(/export default function PasswordChangeModal.*?\n.*?\n.*?\n.*?\{/g, match => match + '\n  const { t } = useLanguage();');
}

let mapPwd = {
  '"সকল ফিল্ড পূরণ করুন"': 't("passwordModal.fillAll")',
  '"নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না"': 't("passwordModal.passMismatch")',
  '"নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"': 't("passwordModal.passLength")',
  '"ডেমো অ্যাডমিন অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন সম্ভব নয়"': 't("passwordModal.demoError")',
  '"বর্তমান পাসওয়ার্ড সঠিক নয়"': 't("passwordModal.wrongOldPass")',
  '"পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি"': 't("passwordModal.errorTitle")',
  '"পাসওয়ার্ড পরিবর্তন"': 't("passwordModal.title")',
  '"সফল হয়েছে!"': 't("passwordModal.successTitle")',
  '"আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।"': 't("passwordModal.successDesc")',
  '"বর্তমান পাসওয়ার্ড দিন"': 't("passwordModal.oldPassPlaceholder")',
  '"নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"': 't("passwordModal.newPassPlaceholder")',
  '"নতুন পাসওয়ার্ড আবার দিন"': 't("passwordModal.confirmPassPlaceholder")',
  '"অপেক্ষা করুন..."': 't("passwordModal.wait")',
  '"পাসওয়ার্ড পরিবর্তন করুন"': 't("passwordModal.submit")'
};

// Also text nodes
pwdCode = pwdCode.replace(/<h3 className="font-semibold">পাসওয়ার্ড পরিবর্তন<\/h3>/g, '<h3 className="font-semibold">{t("passwordModal.title")}</h3>');
pwdCode = pwdCode.replace(/<h4 className="text-emerald-400 font-semibold mb-1">সফল হয়েছে!<\/h4>/g, '<h4 className="text-emerald-400 font-semibold mb-1">{t("passwordModal.successTitle")}</h4>');
pwdCode = pwdCode.replace(/<p className="text-zinc-400 text-sm">আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।<\/p>/g, '<p className="text-zinc-400 text-sm">{t("passwordModal.successDesc")}</p>');
pwdCode = pwdCode.replace(/বর্তমান পাসওয়ার্ড/g, '{t("passwordModal.oldPass")}');
pwdCode = pwdCode.replace(/নতুন পাসওয়ার্ড/g, '{t("passwordModal.newPass")}');
pwdCode = pwdCode.replace(/কনফার্ম \{t\("passwordModal\.newPass"\)\}/g, '{t("passwordModal.confirmPass")}');
pwdCode = pwdCode.replace(/অপেক্ষা করুন\.\.\./g, '{t("passwordModal.wait")}');

for (let key in mapPwd) {
  pwdCode = pwdCode.split(key).join(mapPwd[key]);
}
fs.writeFileSync('src/components/PasswordChangeModal.tsx', pwdCode);
console.log("Patched PasswordChangeModal.tsx");

// Next DepositsTab.tsx
let depCode = fs.readFileSync('src/components/DepositsTab.tsx', 'utf8');
depCode = depCode.replace(/মেস ফান্ডের \{t\("deposits.totalDepositsTitle"\)\}/g, '{t("deposits.totalDepositsTitle")}');
depCode = depCode.replace(/নতুন জমা কনফার্ম করুন/g, '{t("deposits.confirmNewDeposit")}');
depCode = depCode.replace(/জমার তারিখ/g, '{t("deposits.depositDate")}');
depCode = depCode.replace(/কার জমার এন্ট্রি/g, '{t("deposits.depositEntryFor")}');
depCode = depCode.replace(/সদস্য বাছাই করুন/g, '{t("deposits.selectMember")}');
depCode = depCode.replace(/>\s*জমা দিন\s*</g, '>{t("deposits.btnDeposit")}<');
depCode = depCode.replace(/placeholder="\.\.\.হিসাব দিন"/g, 'placeholder={t("deposits.amountPlaceholder")}');
depCode = depCode.replace(/জমার রেকর্ডস/g, '{t("deposits.depositRecords")}');
depCode = depCode.replace(/এখনো কোনো জমার ট্রানজেকশন নেই/g, '{t("deposits.noDepositRecords")}');
fs.writeFileSync('src/components/DepositsTab.tsx', depCode);
console.log("Patched DepositsTab.tsx");

// MealsTab.tsx
let mealCode = fs.readFileSync('src/components/MealsTab.tsx', 'utf8');
mealCode = mealCode.replace(/জন সক্রিয়/g, '{t("meals.activeMembers")}');
mealCode = mealCode.replace(/নির্ধারিত মিল সেট করুন/g, '{t("meals.setFixedMealsBtn")}');
mealCode = mealCode.replace(/মিল সংখ্যা: /g, '{t("meals.mealCountLabel")}');
mealCode = mealCode.replace(/সদস্যদের মিল ওভারভিউ/g, '{t("meals.membersMealOverview")}');
mealCode = mealCode.replace(/:মিল হিসাব/g, ':{t("meals.mealCalcLabel")}');
mealCode = mealCode.replace(/ব্যক্তিগত বা দৈনিক মিল কম-বেশি পরিবর্তনের জন্য নির্ধারিত মিলের জায়গায় আপনার মেসের মোট মিল বা কাস্টম লিমিট সেট করে নিন। এই সিস্টেমটি সহজ ও সরল গণনার জন্য ডিজাইন করা হয়েছে।/g, '{t("meals.mealCalcDesc")}');
fs.writeFileSync('src/components/MealsTab.tsx', mealCode);
console.log("Patched MealsTab.tsx");

// ExpensesTab.tsx
let expCode = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');
expCode = expCode.replace(/সাধারণ \/ মেস ফান্ড \(কেউ ব্যক্তিগতভাবে দেয়নি\)/g, '{t("expensesTab.commonFund")}');
expCode = expCode.replace(/placeholder="যেমন: আলু, ডাল, মুরগি\.\.\."/g, 'placeholder={t("expensesTab.itemDescPlaceholder")}');
expCode = expCode.replace(/ইউটিলিটি ও অন্যান্য বিল \(বিদ্যুৎ, পানি ইত্যাদি\)/g, '{t("expensesTab.utilityBillsTitle")}');
expCode = expCode.replace(/বিলের পরিমাণ/g, '{t("expensesTab.billAmount")}');
expCode = expCode.replace(/placeholder="বিদ্যুৎ বিল, পানি বিল\.\.\."/g, 'placeholder={t("expensesTab.utilityDescPlaceholder")}');
expCode = expCode.replace(/অন্যান্য বিল যোগ করুন/g, '{t("expensesTab.addOtherBill")}');
expCode = expCode.replace(/বাজার খরচের রেকর্ডস/g, '{t("expensesTab.bazaarRecords")}');
fs.writeFileSync('src/components/ExpensesTab.tsx', expCode);
console.log("Patched ExpensesTab.tsx");

