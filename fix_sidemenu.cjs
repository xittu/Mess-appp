const fs = require('fs');

let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

// Fix string literal templates where `{t...}` was inserted
code = code.replace(/\{t\("([^"]+)"\)\}/g, (match, p1) => {
  return `\${t("${p1}")}`;
});

// Oh wait! If it's in JSX, `${t("...")}` is WRONG.
// So I should only fix it if it's inside backticks or quotes, but that's very hard with regex.
