const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dupImports = `
  Headset,
  Mail,
  Phone,
  Headset,
  Mail,
  Phone,
`;
code = code.replace(dupImports, `
  Headset,
  Mail,
  Phone,
`);
fs.writeFileSync('src/App.tsx', code);
