const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFetch = `        if (noticesData && noticesData.length > 0) {
           setGlobalNotices(noticesData);
           setShowNoticePopup(true);
        }`;

const newFetch = `        if (noticesData && noticesData.length > 0) {
           setGlobalNotices(noticesData);
           const dismissed = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
           const hasNew = noticesData.some(n => !dismissed.includes(n.id));
           if (hasNew) {
             setShowNoticePopup(true);
           }
        }`;
code = code.replace(oldFetch, newFetch);

const oldPopup = `          <NoticePopup
            notices={globalNotices}
            onClose={() => setShowNoticePopup(false)}
          />`;

const newPopup = `          <NoticePopup
            notices={globalNotices}
            onClose={() => {
              setShowNoticePopup(false);
              const dismissed = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
              const newDismissed = [...new Set([...dismissed, ...globalNotices.map(n => n.id)])];
              localStorage.setItem('dismissedNotices', JSON.stringify(newDismissed));
            }}
          />`;
code = code.replace(oldPopup, newPopup);

fs.writeFileSync('src/App.tsx', code);
