const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// If the array is still outside, let's fix it properly.
const monthDetailsRegex = /\/\/ Highly stylized mapping[\s\S]*?\];/;
const match = code.match(monthDetailsRegex);

if (match) {
  const monthDetailsCode = match[0];
  code = code.replace(monthDetailsCode, '');
  
  code = code.replace(/export default function Header\(\{.*?\}\s*:\s*HeaderProps\)\s*\{/s, (fullMatch) => {
    return fullMatch + '\n\n  ' + monthDetailsCode.replace(/\n/g, '\n  ') + '\n';
  });
  
  fs.writeFileSync('src/components/Header.tsx', code);
}
