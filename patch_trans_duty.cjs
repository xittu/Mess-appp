const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

code = code.replace(
  '"superAdminDesc": "View all user and mess data and download PDF",',
  '"superAdminDesc": "View all user and mess data and download PDF",\n      "dutySchedule": "Mess Duty Schedule",\n      "dutyScheduleDesc": "Who is responsible for what (shopping, manager) on which day",'
);
code = code.replace(
  '"superAdminDesc": "সকল ইউজার ও মেসের ডাটা দেখুন এবং পিডিএফ ডাউনলোড করুন",',
  '"superAdminDesc": "সকল ইউজার ও মেসের ডাটা দেখুন এবং পিডিএফ ডাউনলোড করুন",\n      "dutySchedule": "মেস ডিউটি রুটিন (Mess Duty Schedule)",\n      "dutyScheduleDesc": "কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার রুটিন",'
);
code = code.replace(
  '"superAdminDesc": "عرض جميع بيانات المستخدم والفوضى وتنزيل ملف PDF",',
  '"superAdminDesc": "عرض جميع بيانات المستخدم والفوضى وتنزيل ملف PDF",\n      "dutySchedule": "جدول واجبات الفوضى",\n      "dutyScheduleDesc": "من هو المسؤول عن ماذا في أي يوم",'
);
code = code.replace(
  '"superAdminDesc": "सभी उपयोगकर्ता और मेस डेटा देखें और पीडीएफ डाउनलोड करें",',
  '"superAdminDesc": "सभी उपयोगकर्ता और मेस डेटा देखें और पीडीएफ डाउनलोड करें",\n      "dutySchedule": "मेस ड्यूटी अनुसूची",\n      "dutyScheduleDesc": "किस दिन किसकी जिम्मेदारी है (खरीदारी, प्रबंधक)",'
);

fs.writeFileSync('src/i18n/translations.ts', code);
console.log("Duty Schedule translated in dict");
