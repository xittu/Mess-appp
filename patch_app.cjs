const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
const importTarget = `import NoticePopup from "./components/NoticePopup";`;
const importInsert = `import FindMessTab from "./components/FindMessTab";\nimport ChatModal from "./components/ChatModal";`;
code = code.replace(importTarget, importTarget + '\n' + importInsert);

// State
const stateTarget = `const [isJobRegisterOpen, setIsJobRegisterOpen] = useState(false);`;
const stateInsert = `
  const [isFindMessOpen, setIsFindMessOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState("");
  const [chatUserName, setChatUserName] = useState("");
`;
code = code.replace(stateTarget, stateTarget + '\n' + stateInsert);

// Passing to SideMenu
const sidemenuTarget = `onOpenAdminPanel={() => setIsAdminPanelOpen(true)}`;
const sidemenuInsert = `onOpenFindMess={() => setIsFindMessOpen(true)}`;
code = code.replace(sidemenuTarget, sidemenuTarget + '\n                ' + sidemenuInsert);

// Rendering modals
const modalsTarget = `{/* Job Register Modal */}`;
const modalsInsert = `
        {/* Find Mess Modal */}
        <AnimatePresence>
          {isFindMessOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-200 dark:bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col relative my-8"
              >
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-zinc-800">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Global Mess Network</h2>
                  <button onClick={() => setIsFindMessOpen(false)} className="p-2 bg-slate-200 dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <FindMessTab 
                    currentUser={currentUser} 
                    onOpenChat={(id, name) => {
                      setChatUserId(id);
                      setChatUserName(name);
                      setIsChatOpen(true);
                    }} 
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Chat Modal */}
        {isChatOpen && currentUser && chatUserId && (
          <ChatModal 
            currentUser={currentUser}
            otherUserId={chatUserId}
            otherUserName={chatUserName}
            onClose={() => setIsChatOpen(false)}
          />
        )}
`;
code = code.replace(modalsTarget, modalsInsert + '\n        ' + modalsTarget);

fs.writeFileSync('src/App.tsx', code);
