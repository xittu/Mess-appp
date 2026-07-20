const fs = require('fs');

function addHook(file) {
    let code = fs.readFileSync(file, 'utf8');
    if (!code.includes('useLanguage')) {
        code = code.replace(/import React(.*?);/, 'import React$1;\nimport { useLanguage } from "../contexts/LanguageContext";');
        code = code.replace(/export default function ([A-Za-z0-9_]+)\(.*?\) \{/, (match) => {
            return match + '\n  const { currencySymbol } = useLanguage();';
        });
        fs.writeFileSync(file, code);
    }
}

addHook('src/components/AdminPanel.tsx');
addHook('src/components/HistoryModal.tsx');
