const fs = require('fs');

let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

// I injected my strings right after `en: {`, `bn: {`, `ar: {`, `hi: {`.
// For example, `en: {\n    passwordModal: { ... },\n    deposits: { ... },\n    meals: { ... }`
// The original `deposits:` and `meals:` are further down.

// For English
code = code.replace(/    deposits: \{\n      totalDepositsTitle: "Total Deposits",\n      confirmNewDeposit: "Confirm New Deposit",\n      depositDate: "Deposit Date",\n      depositEntryFor: "Deposit Entry For",\n      selectMember: "Select Member",\n      btnDeposit: "Deposit",\n      amountPlaceholder: "\.\.\.Enter amount",\n      depositRecords: "Deposit Records",\n      noDepositRecords: "No deposit transactions yet"\n    \},/, '');
code = code.replace(/    deposits: \{/g, `    deposits: {
      totalDepositsTitle: "Total Deposits",
      confirmNewDeposit: "Confirm New Deposit",
      depositDate: "Deposit Date",
      depositEntryFor: "Deposit Entry For",
      selectMember: "Select Member",
      btnDeposit: "Deposit",
      amountPlaceholder: "...Enter amount",
      depositRecords: "Deposit Records",
      noDepositRecords: "No deposit transactions yet",`);

code = code.replace(/    meals: \{\n      activeMembers: "active",\n      setFixedMealsBtn: "Set Fixed Meals",\n      mealCountLabel: "Meal Count: ",\n      membersMealOverview: "Members Meal Overview",\n      mealCalcLabel: "Meal Calculation",\n      mealCalcDesc: "Set the total meals or custom limit for your mess instead of the configured meals for individual or daily changes\. This system is designed for simple and easy calculation\."\n    \},/, '');
code = code.replace(/    meals: \{/g, `    meals: {
      activeMembers: "active",
      setFixedMealsBtn: "Set Fixed Meals",
      mealCountLabel: "Meal Count: ",
      membersMealOverview: "Members Meal Overview",
      mealCalcLabel: "Meal Calculation",
      mealCalcDesc: "Set the total meals or custom limit for your mess instead of the configured meals for individual or daily changes. This system is designed for simple and easy calculation.",`);

// Since there are 4 languages, wait, the replacement `deposits: {` would replace it for ALL languages with English strings!
// I need to be more careful.
