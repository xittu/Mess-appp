const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Find the definition of MONTH_DETAILS and the component start.
const monthDetailsRegex = /\/\/ Highly stylized mapping[\s\S]*?\];/;
const match = code.match(monthDetailsRegex);

if (match) {
  const monthDetailsCode = match[0];
  code = code.replace(monthDetailsCode, '');
  
  // Now place it inside LayoutHeader
  code = code.replace(/export function LayoutHeader\(\{.*?\}\s*:\s*HeaderProps\)\s*\{/s, (fullMatch) => {
    return fullMatch + '\n  const { language, setLanguage, t } = useLanguage();\n\n  ' + monthDetailsCode.replace(/\n/g, '\n  ') + '\n';
  });
  
  // also remove the extra const { language, setLanguage, t } if it exists later in the component
  const tDecl = 'const { language, setLanguage, t } = useLanguage();';
  let firstIdx = code.indexOf(tDecl);
  if (firstIdx !== -1) {
    let secondIdx = code.indexOf(tDecl, firstIdx + 1);
    if (secondIdx !== -1) {
      code = code.slice(0, secondIdx) + code.slice(secondIdx + tDecl.length);
    }
  }
}

fs.writeFileSync('src/components/Header.tsx', code);
