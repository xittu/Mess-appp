const fs = require('fs');
let code = fs.readFileSync('src/components/NoticePopup.tsx', 'utf8');

const oldFilter = `  const [currentIndex, setCurrentIndex] = useState(0);
  const activeNotices = notices.filter(n => n.is_active);`;

const newFilter = `  const [currentIndex, setCurrentIndex] = useState(0);
  
  const dismissed = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
  const activeNotices = notices.filter(n => n.is_active && !dismissed.includes(n.id));`;

code = code.replace(oldFilter, newFilter);
fs.writeFileSync('src/components/NoticePopup.tsx', code);
