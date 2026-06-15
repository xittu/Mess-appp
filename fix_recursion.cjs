const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /if \(getMockUser\(\)\) return getMockUser\(\);/,
  `if ((window as any).__MOCK_USER__) return (window as any).__MOCK_USER__;`
);
fs.writeFileSync('src/App.tsx', code);
console.log("fixed infinite recursion");
