const fs = require('fs');
let code = fs.readFileSync('src/components/MembersTab.tsx', 'utf8');

if (!code.includes('useLanguage')) {
  code = code.replace(
    'import { Member } from "../types";',
    'import { Member } from "../types";\nimport { useLanguage } from "../contexts/LanguageContext";'
  );
}

if (!code.includes('const { t } = useLanguage()')) {
  code = code.replace(
    '  const [memberName, setMemberName] = useState("");',
    '  const { t } = useLanguage();\n  const [memberName, setMemberName] = useState("");'
  );
}

code = code.replace('নতুন সদস্য যোগ করুন', '{t("members.addMemberTitle")}');
code = code.replace('সদস্যের নাম (যেমন: Zitu, Shahadat, Sagor)', '{t("members.memberNamePlaceholder")}');
code = code.replace('সদস্য যোগ করুন', '{t("members.addMemberBtn")}');
code = code.replace('মেস সদস্য তালিকা', '{t("members.memberListTitle")}');
code = code.replace('জন)', '{t("members.peopleCount")})');
code = code.replace('নিবন্ধিত ব্যবহারকারী', '{t("members.registeredUsers")}');
code = code.replace('কোনো সদস্য পাওয়া যায়নি!', '{t("members.noMembersFound")}');
code = code.replace('উপরে নাম দিয়ে প্রথম মেস মেম্বার যুক্ত করুন।', '{t("members.firstMemberPrompt")}');
code = code.replace('জমা টাকা শেষ! ব্যালেন্স বকেয়া', '{t("members.lowBalance")}');

fs.writeFileSync('src/components/MembersTab.tsx', code);
console.log("MembersTab patched with translations");
