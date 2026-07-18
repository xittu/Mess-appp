const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');
code = code.replace(/:\s*"\{t\("expensesTab\.commonFund"\)\}"\}/g, ': t("expensesTab.commonFund")}');
fs.writeFileSync('src/components/ExpensesTab.tsx', code);
