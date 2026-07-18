const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

code = code.replace(
  '<span className="text-sm font-bold text-zinc-100 block">\n                      হিসাব (Final Ledger)\n                    </span>\n                    <span className="text-[11px] text-zinc-400 block mt-0.5">\n                      রিয়েল-টাইম মেস ক্যালকুলেটর ও রিফান্ড ড্যাশবোর্ড\n                    </span>',
  '<span className="text-sm font-bold text-zinc-100 block">\n                      {t("sideMenu.finalLedgerBtn")}\n                    </span>\n                    <span className="text-[11px] text-zinc-400 block mt-0.5">\n                      {t("sideMenu.finalLedgerDesc")}\n                    </span>'
);

code = code.replace(
  '<span className="text-sm font-bold text-zinc-100 block">\n                      ডিউটি ও রুলস (Duties)\n                    </span>\n                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">\n                      মেস শিডিউল ও সদস্যদের দায়িত্বসমূহ\n                    </span>',
  '<span className="text-sm font-bold text-zinc-100 block">\n                      {t("sideMenu.dutiesBtn")}\n                    </span>\n                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">\n                      {t("sideMenu.dutiesDesc")}\n                    </span>'
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
console.log("Patched sideMenu btn names");
