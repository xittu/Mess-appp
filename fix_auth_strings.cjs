const fs = require('fs');

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Replace hardcoded strings with t("auth.XXX")
code = code.replace(/<label[^>]*>\s*Email address\s*<\/label>/g, '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.email")}</label>');
code = code.replace(/<label[^>]*>\s*Full Name\s*<\/label>/g, '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.name")}</label>');
code = code.replace(/<label[^>]*>\s*Password\s*<\/label>/g, '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.password")}</label>');

code = code.replace(/isRegisterMode\s*\?\s*"Create Account"\s*:\s*"Sign In"/g, 'isRegisterMode ? t("auth.signupTitle") : t("auth.loginTitle")');
code = code.replace(/\{isRegisterMode \? t\("auth\.loginBtn"\) : t\("auth\.signupBtn"\)\}/g, '{isRegisterMode ? t("auth.signupBtn") : t("auth.loginBtn")}');

code = code.replace(/Forgot Password\?/g, '{t("auth.forgotPass")}');
code = code.replace(/Don't have an account\?/g, '{t("auth.noAccount")}');
code = code.replace(/Already have an account\?/g, '{t("auth.hasAccount")}');
code = code.replace(/Create Account/g, '{t("auth.signupBtn")}');
code = code.replace(/Sign In/g, '{t("auth.loginBtn")}');

fs.writeFileSync('src/components/AuthScreen.tsx', code);
