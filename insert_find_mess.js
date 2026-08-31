const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const targetStr = `            {/* Data Export (PDF) */}`;
const insertStr = `
            {/* Find Mess Near You */}
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenFindMess) onOpenFindMess();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-brand-amber/10 border border-brand-amber/20 text-brand-amber hover:bg-brand-amber/20 transition-all group"
              >
                <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[15px]">Find Mess Near You</span>
                <Sparkles className="w-4 h-4 ml-auto" />
              </button>
            </div>
`;

code = code.replace(targetStr, insertStr + '\n' + targetStr);
fs.writeFileSync('src/components/SideMenu.tsx', code);
