const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

code = code.replace('দৈনিক বাজার যোগ করুন', '{t("expenses.addDailyBazaar")}');
code = code.replace('তারিখ নির্বাচন করুন', '{t("expenses.selectDate")}');
code = code.replace('টাকার পরিমাণ (৳)', '{t("expenses.amountAmount")}');
code = code.replace('বাজারকারী নির্বাচন করুন', '{t("expenses.selectBazaarMember")}');
code = code.replace('বাজার বিবরণ (ঐচ্ছিক)', '{t("expenses.bazaarDetailsOptional")}');
code = code.replace('খরচ যোগ করুন', '{t("expenses.addExpenseBtn")}');
code = code.replace('মোট বাজার খরচ', '{t("expenses.totalBazaarExpense")}');
code = code.replace('অন্যান্য ও ইউটিলিটি বিল', '{t("expenses.otherUtilityBills")}');
code = code.replace('মোট ইউটিলিটি খরচ', '{t("expenses.totalUtilityExpense")}');
code = code.replace('নতুন ইউটিলিটি বিল যোগ করুন', '{t("expenses.addUtilityBill")}');
code = code.replace('বিলের ধরন / নাম', '{t("expenses.billTypeLabel")}');
code = code.replace('বিল যোগ করুন', '{t("expenses.addBillBtn")}');
code = code.replace('পরিমাণ', '{t("expenses.amount")}');
code = code.replace('যেমন: চাল, ডাল, আলু, পেঁয়াজ...', '{t("expenses.expenseDescPlaceholder")}');
code = code.replace('সাম্প্রতিক বাজারের তালিকা', '{t("expenses.recentBazaar")}');
code = code.replace('কোনো বাজার খরচ যোগ করা হয়নি।', '{t("expenses.noExpenses")}');
code = code.replace('যেমন: বুয়ার বিল, গ্যাস বিল, ওয়াইফাই', '{t("expenses.utilPlaceholder")}');
code = code.replace('এই রেকর্ড মুছতে চান?', '{t("expenses.deletePrompt")}');
code = code.replace('আপনি কি নিশ্চিত যে আপনি এই খরচ মুছতে চান?', '{t("expenses.deleteConfirm")}');
code = code.replace('ভয়েস ইনপুট (যেমন: সাগর ৫০০ টাকা)', '{t("expenses.voiceTooltip")}');
code = code.replace('শুনছি...', '{t("expenses.listening")}');
code = code.replace('মেম্বার নেই', '{t("expenses.noMembers")}');
code = code.replace('মেম্বার নির্বাচন করুন', '{t("expenses.selectMember")}');

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
console.log("ExpensesTab patched");
