const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
code = code.replace(/className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-3 leading-tight"/, 'className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-3 leading-tight"');
fs.writeFileSync('src/components/LandingPage.tsx', code);
