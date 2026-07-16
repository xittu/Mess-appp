const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

// Add "old_sessions" to activeModal
code = code.replace(
  /"ledger" \| "duty" \| "fixed_meal_info" \| "job_register" \| "export_pdf" \| "new_session" \| null/g,
  '"ledger" | "duty" | "fixed_meal_info" | "job_register" | "export_pdf" | "new_session" | "old_sessions" | null'
);

// Add the button for "old_sessions"
const oldSessionsButton = `
              <button
                onClick={() => setActiveModal("old_sessions")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-950/10 hover:bg-blue-950/20 border border-blue-900/35 hover:border-blue-500/40 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-blue-300 block font-sans">
                      পুরনো সেশন (Old Sessions)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                      পূর্ববর্তী সেশনের ডাটা পুনরুদ্ধার করুন
                    </span>
                  </div>
                </div>
              </button>
`;

code = code.replace(
  /              <button\n                onClick=\{\(\) => setActiveModal\("export_pdf"\)\}/,
  oldSessionsButton + '              <button\n                onClick={() => setActiveModal("export_pdf")}'
);

// Ensure History is imported from lucide-react
if (!code.includes('History,')) {
  code = code.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import { History, $1 } from "lucide-react";');
}

fs.writeFileSync('src/components/SideMenu.tsx', code);
