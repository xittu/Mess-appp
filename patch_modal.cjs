const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `onOpenFindMess={() => setIsFindMessOpen(true)}`,
  `onOpenFindMess={() => { toast.info("Opening Find Mess Modal"); setIsFindMessOpen(true); }}`
);

// Add key to modal just in case
code = code.replace(
  `{isFindMessOpen && (
            <div className="fixed inset-0`,
  `{isFindMessOpen && (
            <div key="find-mess-modal" className="fixed inset-0`
);

fs.writeFileSync('src/App.tsx', code);
