const fs = require('fs');

let code = fs.readFileSync('src/components/HistoryModal.tsx', 'utf8');
code = code.replace(/const contentRef = useRef<HTMLDivElement>\(null\);/, 'const { currencySymbol } = useLanguage();\n  const contentRef = useRef<HTMLDivElement>(null);');
fs.writeFileSync('src/components/HistoryModal.tsx', code);
