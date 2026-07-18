const fs = require('fs');

const files = [
  'src/components/MembersTab.tsx',
  'src/components/MealsTab.tsx',
  'src/components/ExpensesTab.tsx',
  'src/components/DepositsTab.tsx',
  'src/components/BazaarTab.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/placeholder="\{t\((.*?)\)\}"/g, 'placeholder={t($1)}');
  code = code.replace(/title="\{t\((.*?)\)\}"/g, 'title={t($1)}');
  fs.writeFileSync(file, code);
}

console.log("Fixed quotes around translation hooks");
