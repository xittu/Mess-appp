const fs = require('fs');
let code = fs.readFileSync('src/components/BazaarTab.tsx', 'utf8');

if (!code.includes('useLanguage')) {
  code = code.replace(
    'import { ShoppingCart, Plus, Check, Trash2, CalendarDays, UserSquare2 } from "lucide-react";',
    'import { ShoppingCart, Plus, Check, Trash2, CalendarDays, UserSquare2 } from "lucide-react";\nimport { useLanguage } from "../contexts/LanguageContext";'
  );
}
if (!code.includes('const { t } = useLanguage()')) {
  code = code.replace(
    '  const [newItemText, setNewItemText] = useState("");',
    '  const { t } = useLanguage();\n  const [newItemText, setNewItemText] = useState("");'
  );
}

code = code.replace('নতুন বাজার তালিকা যোগ করুন', '{t("bazaar.addBazaarItem")}');
code = code.replace('পণ্যের নাম (যেমন: চাল, ডাল)', '{t("bazaar.itemName")}');
code = code.replace('তালিকায় যোগ করুন', '{t("bazaar.addBtn")}');
code = code.replace('বাজার তালিকা', '{t("bazaar.shoppingList")}');
code = code.replace('কোনো আইটেম নেই।', '{t("bazaar.noItems")}');
code = code.replace('সম্পন্ন', '{t("bazaar.completed")}');
code = code.replace('তালিকা মুছুন', '{t("bazaar.clearList")}');
code = code.replace('দৈনিক বাজার ডিউটি', '{t("bazaar.dailyDuty")}');
code = code.replace('ডিউটির জন্য সদস্য নির্বাচন করুন', '{t("bazaar.selectDutyMember")}');
code = code.replace('ডিউটি সেট করা নেই', '{t("bazaar.noDutySet")}');
code = code.replace('ডিউটি দিন', '{t("bazaar.assignDuty")}');

fs.writeFileSync('src/components/BazaarTab.tsx', code);
console.log("BazaarTab patched");
