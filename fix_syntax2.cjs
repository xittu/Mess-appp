const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

code = code.replace(/\? \{t\("auth\.hasAccount"\)\} \+ " "/g, '? t("auth.hasAccount") + " "');
code = code.replace(/: \{t\("auth\.noAccount"\)\} \+ " "/g, ': t("auth.noAccount") + " "');

fs.writeFileSync('src/components/AuthScreen.tsx', code);
