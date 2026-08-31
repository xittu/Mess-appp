const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import if not exists
if (!code.includes("import { App as CapacitorApp } from '@capacitor/app';")) {
  code = code.replace(
    `import { motion, AnimatePresence } from "framer-motion";`,
    `import { motion, AnimatePresence } from "framer-motion";\nimport { App as CapacitorApp } from '@capacitor/app';`
  );
}

// Add state for back press
if (!code.includes("const backPressCountRef")) {
  code = code.replace(
    `const [missingAttendance, setMissingAttendance] = useState<boolean>(false);`,
    `const [missingAttendance, setMissingAttendance] = useState<boolean>(false);
  const backPressCountRef = useRef(0);`
  );
}

// Add effect for back button
if (!code.includes("CapacitorApp.addListener('backButton'")) {
  const backLogic = `  // --- Capacitor Back Button Logic ---
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      // 1. Close Modals first
      if (isFindMessOpen) {
        setIsFindMessOpen(false);
        return;
      }
      if (isJobRegisterOpen) {
        setIsJobRegisterOpen(false);
        return;
      }
      if (isChatOpen) {
        setIsChatOpen(false);
        return;
      }
      if (showHistory) {
        setShowHistory(false);
        return;
      }
      if (isMenuOpen) {
        setIsMenuOpen(false);
        return;
      }
      if (showAdminPanel) {
        setShowAdminPanel(false);
        return;
      }
      
      // 2. If not on Home tab (0), go to Home tab
      if (activeTab !== 0) {
        setActiveTab(0);
        return;
      }
      
      // 3. If on Home tab, double press to exit
      if (backPressCountRef.current === 0) {
        backPressCountRef.current = 1;
        toast.info(t('sideMenu.pressBackExit') || "Press back again to exit");
        timeout = setTimeout(() => {
          backPressCountRef.current = 0;
        }, 2000);
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
      if (timeout) clearTimeout(timeout);
    };
  }, [
    isFindMessOpen, 
    isJobRegisterOpen, 
    isChatOpen, 
    showHistory, 
    isMenuOpen, 
    showAdminPanel, 
    activeTab, 
    t
  ]);`;

  code = code.replace(
    `// --- In-App Notifications Feed & Toasts ---`,
    `${backLogic}\n\n  // --- In-App Notifications Feed & Toasts ---`
  );
}

fs.writeFileSync('src/App.tsx', code);
