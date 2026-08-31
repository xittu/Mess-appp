const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const targetStr = `              {isAdmin && (
                <button
                  onClick={onOpenAdminPanel}`;
                  
const insertStr = `
              <button
                onClick={() => {
                  onClose();
                  if (onOpenFindMess) onOpenFindMess();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all text-left cursor-pointer group mb-2"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-purple-300 block font-sans">
                      Find Mess Near You
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-zinc-400 block mt-0.5 leading-relaxed">
                      Connect with messes around you
                    </span>
                  </div>
                </div>
              </button>
`;

code = code.replace(targetStr, insertStr + '\n' + targetStr);
fs.writeFileSync('src/components/SideMenu.tsx', code);
