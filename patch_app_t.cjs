const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { useLanguage } from "./contexts/LanguageContext";')) {
  code = code.replace(
    'import Header from "./components/Header";',
    'import Header from "./components/Header";\nimport { useLanguage } from "./contexts/LanguageContext";'
  );
}

if (!code.includes('const { t } = useLanguage();') && !code.includes('const { language, t } = useLanguage();')) {
  code = code.replace(
    '  const [isMenuOpen, setIsMenuOpen] = useState(false);',
    '  const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const { t } = useLanguage();'
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx t hook patched");
