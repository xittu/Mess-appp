const fs = require('fs');
let code = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

if (!code.includes('currencySymbol: string')) {
    code = code.replace(/t: \(key: string\) => string;/, 't: (key: string) => string;\n  currencySymbol: string;');
    
    code = code.replace(/const t = \(key: string\) => \{/, `const getCurrencySymbol = (lang: LanguageType) => {
    switch (lang) {
      case 'en': return '$';
      case 'hi': return '₹';
      case 'ar': return 'ر.س';
      case 'bn':
      default: return '৳';
    }
  };
  
  const currencySymbol = getCurrencySymbol(language);

  const t = (key: string) => {`);
    
    code = code.replace(/value=\{\{ language, setLanguage, t \}\}/, 'value={{ language, setLanguage, t, currencySymbol }}');
    
    fs.writeFileSync('src/contexts/LanguageContext.tsx', code);
}
