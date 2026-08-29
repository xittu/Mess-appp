const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const getMockUser = \(\) => \{[\s\S]*?try \{[\s\S]*?return JSON.parse\(localStorage\.getItem\("__MOCK_USER__"\) \|\| "null"\);[\s\S]*?\} catch \(e\) \{[\s\S]*?return null;[\s\S]*?\}[\s\S]*?\};/g, 'const getMockUser = () => { return null; };');
fs.writeFileSync('src/App.tsx', code);
