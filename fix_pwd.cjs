const fs = require('fs');

let code = fs.readFileSync('src/components/PasswordChangeModal.tsx', 'utf8');

// Fix the syntax errors
code = code.replace(/setError\("\{t\("passwordModal\.newPass"\)\} এবং কনফার্ম পাসওয়ার্ড মিলছে না"\);/g, 'setError(t("passwordModal.passMismatch"));');
code = code.replace(/setError\("\{t\("passwordModal\.newPass"\)\} কমপক্ষে ৬ অক্ষরের হতে হবে"\);/g, 'setError(t("passwordModal.passLength"));');
code = code.replace(/throw new Error\("\{t\("passwordModal\.demoError"\)\}"\);/g, 'throw new Error(t("passwordModal.demoError"));');
code = code.replace(/throw new Error\("\{t\("passwordModal\.wrongOldPass"\)\}"\);/g, 'throw new Error(t("passwordModal.wrongOldPass"));');
code = code.replace(/setError\(err\.message \|\| "\{t\("passwordModal\.errorTitle"\)\}"\);/g, 'setError(err.message || t("passwordModal.errorTitle"));');

// Look for placeholder="{t("passwordModal.oldPassPlaceholder")}" -> it should be placeholder={t("passwordModal.oldPassPlaceholder")}
code = code.replace(/placeholder="\{t\("passwordModal.oldPassPlaceholder"\)\}"/g, 'placeholder={t("passwordModal.oldPassPlaceholder")}');
code = code.replace(/placeholder="\{t\("passwordModal.newPassPlaceholder"\)\}"/g, 'placeholder={t("passwordModal.newPassPlaceholder")}');
code = code.replace(/placeholder="\{t\("passwordModal.confirmPassPlaceholder"\)\}"/g, 'placeholder={t("passwordModal.confirmPassPlaceholder")}');

fs.writeFileSync('src/components/PasswordChangeModal.tsx', code);
