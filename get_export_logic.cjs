const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
const lines = code.split('\n');
let exportLogic = '';
let inExport = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleExportPDF =')) {
    inExport = true;
  }
  if (inExport) {
    exportLogic += lines[i] + '\n';
  }
  if (inExport && lines[i].includes('// --- Handle File Exports ---')) {
     break;
  }
}
console.log(exportLogic);
