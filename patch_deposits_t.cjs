const fs = require('fs');
let code = fs.readFileSync('src/components/DepositsTab.tsx', 'utf8');

if (!code.includes('useLanguage')) {
  code = code.replace(
    'import { Member, Deposit, DepositHistory } from "../types";',
    'import { Member, Deposit, DepositHistory } from "../types";\nimport { useLanguage } from "../contexts/LanguageContext";'
  );
}
if (!code.includes('const { t } = useLanguage()')) {
  code = code.replace(
    '  const [selectedMemberId, setSelectedMemberId] = useState("");',
    '  const { t } = useLanguage();\n  const [selectedMemberId, setSelectedMemberId] = useState("");'
  );
}

code = code.replace('নতুন জমা যোগ করুন', '{t("deposits.addDepositTitle")}');
code = code.replace('সদস্য নির্বাচন করুন', '{t("deposits.selectMember")}');
code = code.replace('জমা পরিমাণ (৳)', '{t("deposits.amountLabel")}');
code = code.replace('তারিখ (ঐচ্ছিক)', '{t("deposits.dateLabelOptional")}');
code = code.replace('টাকা জমা দিন', '{t("deposits.depositBtn")}');
code = code.replace('মোট জমা', '{t("deposits.totalDepositsTitle")}');
code = code.replace('জমার ইতিহাস', '{t("deposits.depositHistoryTitle")}');
code = code.replace('কোনো জমা ইতিহাস নেই।', '{t("deposits.noDepositsYet")}');
code = code.replace('সাম্প্রতিক লেনদেন', '{t("deposits.recentTxs")}');
code = code.replace('সদস্য নির্বাচন করুন', '{t("deposits.selectMemberPrompt")}');
code = code.replace('সদস্য নেই', '{t("deposits.noMembersAvailable")}');

fs.writeFileSync('src/components/DepositsTab.tsx', code);
console.log("DepositsTab patched");
