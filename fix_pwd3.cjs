const fs = require('fs');
let pwd = fs.readFileSync('src/components/PasswordChangeModal.tsx', 'utf8');
pwd = pwd.replace(/placeholder="\{t\("passwordModal\.newPass"\)\} আবার দিন"/g, 'placeholder={t("passwordModal.confirmPassPlaceholder")}');
pwd = pwd.replace(/throw new Error\("\{t\("passwordModal\.oldPass"\)\} সঠিক নয়"\);/g, 'throw new Error(t("passwordModal.wrongOldPass"));');
fs.writeFileSync('src/components/PasswordChangeModal.tsx', pwd);
