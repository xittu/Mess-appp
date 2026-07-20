const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/*.tsx');

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('৳')) {
      if (!code.includes('currencySymbol')) {
          if (code.includes('const { t, language } = useLanguage();')) {
              code = code.replace(/const \{ t, language \} = useLanguage\(\);/g, 'const { t, language, currencySymbol } = useLanguage();');
          } else if (code.includes('const { t } = useLanguage();')) {
              code = code.replace(/const \{ t \} = useLanguage\(\);/g, 'const { t, currencySymbol } = useLanguage();');
          } else if (code.includes('const { language, setLanguage, t } = useLanguage();')) {
              code = code.replace(/const \{ language, setLanguage, t \} = useLanguage\(\);/g, 'const { language, setLanguage, t, currencySymbol } = useLanguage();');
          } else {
              // try matching any useLanguage
              code = code.replace(/const\s+\{([^}]+)\}\s*=\s*useLanguage\(\);/, (match, p1) => {
                  return `const { ${p1.trim()}, currencySymbol } = useLanguage();`;
              });
          }
      }
      
      // Now replace ৳ based on context
      // First string template ones
      code = code.replace(/`([^`]*?)৳([^`]*?)`/g, '`$1${currencySymbol}$2`');
      code = code.replace(/`([^`]*?)৳([^`]*?)`/g, '`$1${currencySymbol}$2`'); // twice just in case multiple in one line
      
      // JSX ones
      code = code.replace(/>([^<]*?)৳([^<]*?)</g, '>$1{currencySymbol}$2<');
      code = code.replace(/>([^<]*?)৳([^<]*?)</g, '>$1{currencySymbol}$2<');
      
      // any remaining string literal ones inside JSX?
      // "৳" => currencySymbol (if it's just the symbol) or `currencySymbol`
      code = code.replace(/"৳"/g, 'currencySymbol');
      code = code.replace(/'৳'/g, 'currencySymbol');
      
      fs.writeFileSync(file, code);
  }
}
