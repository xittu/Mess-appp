const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

// Add keys to English
code = code.replace(
  `"cancel": "Cancel"
    },`,
  `"cancel": "Cancel",
      "findMess": "Find Mess Near You",
      "theme": "Theme",
      "light": "Light",
      "dark": "Dark",
      "systemDefault": "System Default",
      "pressBackExit": "Press back again to exit",
      "globalMessNetwork": "Global Mess Network"
    },`
);

// Add keys to Bengali
code = code.replace(
  `"cancel": "বাতিল করুন"
    },`,
  `"cancel": "বাতিল করুন",
      "findMess": "আশেপাশের মেস খুঁজুন",
      "theme": "থিম",
      "light": "হালকা (Light)",
      "dark": "অন্ধকার (Dark)",
      "systemDefault": "সিস্টেম ডিফল্ট",
      "pressBackExit": "বের হতে আবার ব্যাক চাপুন",
      "globalMessNetwork": "গ্লোবাল মেস নেটওয়ার্ক"
    },`
);

fs.writeFileSync('src/i18n/translations.ts', code);
