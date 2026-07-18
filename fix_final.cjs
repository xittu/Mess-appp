const fs = require('fs');

let side = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');
side = side.replace(/"<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো আলাদা \{t\("sideMenuFixed\.utilityCost"\)\} বিল যুক্ত করা হয়নি।<\/td><\/tr>"/g, '`<tr><td colspan=\'2\' style=\'padding: 20px; text-align: center; color: #94a3b8;\'>কোনো আলাদা ${t("sideMenuFixed.utilityCost")} বিল যুক্ত করা হয়নি।</td></tr>`');
fs.writeFileSync('src/components/SideMenu.tsx', side);

let pwd = fs.readFileSync('src/components/PasswordChangeModal.tsx', 'utf8');
pwd = pwd.replace(/throw new Error\("\{t\("passwordModal\.oldPass"\)\} সঠিক নয়"\);/g, 'throw new Error(t("passwordModal.wrongOldPass"));');
pwd = pwd.replace(/<label className="block text-xs font-medium text-zinc-400 mb-1\.5 ml-1">\s*\{t\("passwordModal\.oldPass"\)\}\s*<\/label>/g, '<label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">{t("passwordModal.oldPass")}</label>');
pwd = pwd.replace(/<label className="block text-xs font-medium text-zinc-400 mb-1\.5 ml-1">\s*\{t\("passwordModal\.newPass"\)\}\s*<\/label>/g, '<label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">{t("passwordModal.newPass")}</label>');
pwd = pwd.replace(/<label className="block text-xs font-medium text-zinc-400 mb-1\.5 ml-1">\s*\{t\("passwordModal\.confirmPass"\)\}\s*<\/label>/g, '<label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">{t("passwordModal.confirmPass")}</label>');

// Let's check where the other errors are:
// src/components/PasswordChangeModal.tsx(143,51): error TS1003: Identifier expected.
// (145,20): error TS1382: Unexpected token. Did you mean `{'>'}` or `&gt;`?
