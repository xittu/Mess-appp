const fs = require('fs');

// 1. Header.tsx fixes
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(/MONTH_DETAILS\[0\];/g, 'MONTH_DETAILS[0];'); // nothing specific, just verify

// Wait, the dates are defined in Header.tsx:
// { id: "January 2026", enShort: "JAN", bnFull: t("header.jan"), bnShort: t("header.janShort") }
// And printed as {currentMonthDetail.bnFull} which will output the month name in whichever language is active.

// 2. MembersTab.tsx fixes
let members = fs.readFileSync('src/components/MembersTab.tsx', 'utf8');
members = members.replace(/>বাদ দিন</g, '>{t("members.btnRemove")}<');
members = members.replace(/placeholder="সদস্যের নাম \(যেমন: জিতু, সাগর\)"/g, 'placeholder={t("members.memberNamePlaceholder")}');
members = members.replace(/>নতুন সদস্য যোগ করুন</g, '>{t("members.addMember")}<');
members = members.replace(/>সদস্য যোগ করুন</g, '>{t("members.btnAdd")}<');
members = members.replace(/>মেস সদস্য তালিকা \(([\s\S]*?) লোক\)</g, '>{t("members.memberListTitle")} ({$1})<'); // Need to safely replace this

fs.writeFileSync('src/components/MembersTab.tsx', members);

// 3. BazaarTab.tsx fixes
let bazaar = fs.readFileSync('src/components/BazaarTab.tsx', 'utf8');
bazaar = bazaar.replace(/>Total Bazaar Expense</g, '>{t("bazaar.totalBazaarExpense")}<');
bazaar = bazaar.replace(/>Other & Utility Bills</g, '>{t("bazaar.otherUtilityBills")}<');
bazaar = bazaar.replace(/>Add Daily Bazaar</g, '>{t("bazaar.addDailyBazaar")}<');
bazaar = bazaar.replace(/>Voice Entry</g, '>{t("bazaar.voiceEntry")}<');
bazaar = bazaar.replace(/>Select Date</g, '>{t("bazaar.selectDate")}<');
bazaar = bazaar.replace(/>Amount \(৳\)</g, '>{t("bazaar.amount")}<');
bazaar = bazaar.replace(/>Select Buyer \(Who spent\?\)</g, '>{t("bazaar.selectBuyer")}<');
bazaar = bazaar.replace(/>Shopping Details \(Optional\)</g, '>{t("bazaar.shoppingDetails")}<');
bazaar = bazaar.replace(/placeholder="e\.g\., Potato, Rice, Chicken\.\.\."/g, 'placeholder={t("bazaar.shoppingPlaceholder")}');
bazaar = bazaar.replace(/>Weekly Bazaar Duty</g, '>{t("bazaar.weeklyDuty")}<');
bazaar = bazaar.replace(/>No duty set\. Set routine from 'More' menu\.</g, '>{t("bazaar.noDutySet")}<');
bazaar = bazaar.replace(/>Shared Bazaar List</g, '>{t("bazaar.sharedList")}<');
bazaar = bazaar.replace(/placeholder="New bazaar item\.\.\."/g, 'placeholder={t("bazaar.newItem")}');
bazaar = bazaar.replace(/>The list is empty\.</g, '>{t("bazaar.emptyList")}<');
fs.writeFileSync('src/components/BazaarTab.tsx', bazaar);

// 4. MealsTab.tsx fixes
let meals = fs.readFileSync('src/components/MealsTab.tsx', 'utf8');
meals = meals.replace(/>ভোজন সংখ্যা \(কুল या दैनिक औसत\)</g, '>{t("meals.totalMealsOrAvg")}<'); // Ah wait, earlier it was hardcoded or mixed?
meals = meals.replace(/>Set Fixed Meals</g, '>{t("meals.setFixedMealsBtn")}<');
meals = meals.replace(/>Members Meal Overview</g, '>{t("meals.membersMealOverview")}<');
meals = meals.replace(/>Meal Count:/g, '>{t("meals.mealCountLabel")}<');
meals = meals.replace(/>মিল হিসাব:</g, '>{t("meals.mealCount")}<');
meals = meals.replace(/>টি</g, '>{t("meals.individualMeals")}<');

// Try replacing the long string about meal calc desc
meals = meals.replace(/>ব্যক্তিগত বা দৈনিক মিল কম-বেশি পরিবর্তনের জন্য নির্ধারিত মিলের জায়গায় আপনার মেসের মোট মিল বা কাস্টম লিমিট সেট করে নিন। এই সিস্টেমটি সহজ ও সরল গণনার জন্য ডিজাইন করা হয়েছে।</g, '>{t("meals.mealCalcDesc")}<');
meals = meals.replace(/>Total Meals \(Total or Daily Avg\)</g, '>{t("meals.totalMealsOrAvg")}<');
meals = meals.replace(/>Total Meals Count</g, '>{t("meals.totalMealsCount")}<');
fs.writeFileSync('src/components/MealsTab.tsx', meals);

// 5. SideMenu.tsx fixes
let sideMenu = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
sideMenu = sideMenu.replace(/>Mess Duty Schedule</g, '>{t("sideMenu.dutiesBtn")}<');
sideMenu = sideMenu.replace(/>Routine for responsibilities \(Bazaar, Meal Manager, Cleaner\)</g, '>{t("sideMenu.dutiesDesc")}<');
sideMenu = sideMenu.replace(/>Days Assigned</g, '>{t("sideMenu.daysAssigned")}<');
fs.writeFileSync('src/components/SideMenu.tsx', sideMenu);

