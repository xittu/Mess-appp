const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/messName\];/g, "messName];"); // dummy

code = code.replace(/messName\n    \);/g, 'messName,\n      bazaarList\n    );');
code = code.replace(/newName\n    \);/g, 'newName,\n      bazaarList\n    );');
code = code.replace(/messName\);/g, 'messName, bazaarList);');
code = code.replace(/"মেস ড্যাশবোর্ড",\n      bazaarList/g, '"মেস ড্যাশবোর্ড",\n      []');

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
