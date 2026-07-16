const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  '  const handleExportArchivePDF = (archive: any) => {',
  '  const handleExportArchivePDF = (archive: any) => {\n    if (!archive || (!archive.expenses && !archive.utilities && !archive.deposits)) {\n      alert("Failed! The old session data has been deleted from the database or is unavailable.");\n      return;\n    }'
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
