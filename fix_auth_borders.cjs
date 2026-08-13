const fs = require('fs');

let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

content = content.replace(/text-\[#FAF9FB\]/g, 'text-slate-900 dark:text-[#FAF9FB]');
content = content.replace(/(?<!dark:)border-\[#211A35\]/g, 'border-slate-300 dark:border-[#211A35]');
content = content.replace(/(?<!dark:)border-\[#251D3A\]/g, 'border-slate-300 dark:border-[#251D3A]');
content = content.replace(/(?<!dark:)border-\[#2B1F43\]/g, 'border-slate-300 dark:border-[#2B1F43]');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log('Fixed AuthScreen borders and text');
