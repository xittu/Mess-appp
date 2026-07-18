const fs = require('fs');

const files = [
  'src/components/MembersTab.tsx',
  'src/components/ExpensesTab.tsx',
  'src/components/DepositsTab.tsx',
  'src/components/BazaarTab.tsx',
  'src/components/MealsTab.tsx',
  'src/components/AuthScreen.tsx',
  'src/App.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!code.includes('import { useLanguage } from "../contexts/LanguageContext";') && 
      !code.includes('import { useLanguage } from "./contexts/LanguageContext";')) {
    
    // add import at the top
    code = code.replace(/import React.*?;/g, match => match + '\nimport { useLanguage } from "../contexts/LanguageContext";');
    changed = true;
  }

  if (!code.includes('const { t } = useLanguage();') && !code.includes('const { language, setLanguage, t } = useLanguage();')) {
    // Add inside the component
    // match `export default function ComponentName({ ... }) {` or similar
    code = code.replace(/(export default function [a-zA-Z0-9_]+\(.*?\)\s*\{)/s, match => match + '\n  const { t } = useLanguage();');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, code);
    console.log("Fixed", file);
  }
}
