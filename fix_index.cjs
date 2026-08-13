const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('@variant dark', '@custom-variant dark');
fs.writeFileSync('src/index.css', css);
