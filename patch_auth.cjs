const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const importHook = `import { useLanguage } from "../contexts/LanguageContext";
import { LanguageType } from "../i18n/translations";`;

code = code.replace(
  'import { supabase } from "../lib/supabase";',
  'import { supabase } from "../lib/supabase";\n' + importHook
);

const hooksHook = `  const [showResendEmail, setShowResendEmail] = useState(false);`;
const hooksReplacement = `  const [showResendEmail, setShowResendEmail] = useState(false);
  const { language, setLanguage, t } = useLanguage();`;
code = code.replace(hooksHook, hooksReplacement);

const fbStyleSwitcher = `
      {/* Facebook-style language switcher */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] md:text-[11px] text-zinc-500 max-w-sm px-4">
        {(['en', 'bn', 'ar', 'hi'] as LanguageType[]).map((lang, idx) => (
          <React.Fragment key={lang}>
            <button
              onClick={() => setLanguage(lang)}
              className={\`hover:underline cursor-pointer transition-colors \${language === lang ? 'text-purple-400 font-bold' : 'hover:text-purple-300'}\`}
            >
              {lang === 'en' ? 'English' : lang === 'bn' ? 'বাংলা' : lang === 'ar' ? 'العربية' : 'हिन्दी'}
            </button>
            {idx < 3 && <span className="text-zinc-700">•</span>}
          </React.Fragment>
        ))}
      </div>
`;

const footerHook = `      {/* Back to Home decorative button matching screenshot */}`;
code = code.replace(footerHook, fbStyleSwitcher + "\n" + footerHook);

// Also need to use `t` for translations inside AuthScreen
// "Update Password", "Reset Password", "Create Account", "Sign In"
// "Enter your new password below" etc...
// This might be a bit extensive to replace via regex manually. Let's do string replacement for the static strings in JSX.

code = code.replace(
  '{isUpdatePasswordMode ? "Update Password" : isForgotPasswordMode ? "Reset Password" : isRegisterMode ? "Create Account" : "Sign In"}',
  '{isUpdatePasswordMode ? "Update Password" : isForgotPasswordMode ? "Reset Password" : isRegisterMode ? t("auth.signupTitle") : t("auth.loginTitle")}'
);
code = code.replace(
  '{isRegisterMode ? "Create Account" : "Sign In"}',
  '{isRegisterMode ? t("auth.signupBtn") : t("auth.loginBtn")}'
);
code = code.replace(
  '{isRegisterMode ? "Already have an account? " : "Don\'t have an account? "}',
  '{isRegisterMode ? t("auth.hasAccount") + " " : t("auth.noAccount") + " "}'
);
code = code.replace(
  'isRegisterMode ? "Sign in" : "Create Account"',
  'isRegisterMode ? t("auth.loginBtn") : t("auth.signupBtn")'
);

code = code.replace(
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">\n                    Your Name\n                  </label>',
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.name")}</label>'
);
code = code.replace(
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">\n                Email\n              </label>',
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.email")}</label>'
);
code = code.replace(
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">\n                Password\n              </label>',
  '<label className="text-xs font-semibold text-zinc-300 tracking-wide">{t("auth.password")}</label>'
);
code = code.replace(
  'Forgot Password?',
  '{t("auth.forgotPass")}'
);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
console.log("Patched AuthScreen");
