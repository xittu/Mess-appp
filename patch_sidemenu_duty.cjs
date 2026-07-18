const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const targetStr = `<span className="text-sm font-bold text-amber-500 block font-sans">
                        মেস ডিউটি রুটিন (Mess Duty Schedule)
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                        কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার
                        রুটিন
                      </span>`;

const replaceStr = `<span className="text-sm font-bold text-amber-500 block font-sans">
                        {t("sideMenu.dutySchedule")}
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                        {t("sideMenu.dutyScheduleDesc")}
                      </span>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/SideMenu.tsx', code);
console.log("Patched duty schedule in SideMenu");
