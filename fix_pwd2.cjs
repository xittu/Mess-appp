const fs = require('fs');
let pwd = fs.readFileSync('src/components/PasswordChangeModal.tsx', 'utf8');
pwd = pwd.replace(/placeholder="\{t\("passwordModal\.oldPass"\)\} দিন"/g, 'placeholder={t("passwordModal.oldPassPlaceholder")}');
pwd = pwd.replace(/placeholder="\{t\("passwordModal\.newPass"\)\} দিন \(কমপক্ষে ৬ অক্ষর\)"/g, 'placeholder={t("passwordModal.newPassPlaceholder")}');
pwd = pwd.replace(/placeholder="\{t\("passwordModal\.confirmPass"\)\} আবার দিন"/g, 'placeholder={t("passwordModal.confirmPassPlaceholder")}');
fs.writeFileSync('src/components/PasswordChangeModal.tsx', pwd);
