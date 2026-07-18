const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const adminTarget = `<span className="text-sm font-bold text-brand-amber block font-sans">
                        সুপার অ্যাডমিন প্যানেল
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                        সকল ইউজার ও মেসের ডাটা দেখুন এবং পিডিএফ ডাউনলোড করুন
                      </span>`;
const adminReplace = `<span className="text-sm font-bold text-brand-amber block font-sans">
                        {t("sideMenu.superAdmin")}
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                        {t("sideMenu.superAdminDesc")}
                      </span>`;
code = code.replace(adminTarget, adminReplace);

fs.writeFileSync('src/components/SideMenu.tsx', code);
console.log("Patched Super Admin Panel translation");
