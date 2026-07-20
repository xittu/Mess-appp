const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \{ t \} = useLanguage\(\);/, 'const { t, currencySymbol } = useLanguage();');
code = code.replace(/৳/g, '${currencySymbol}');

fs.writeFileSync('src/App.tsx', code);
