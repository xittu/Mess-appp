const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [darkMode, setDarkMode] = useState<boolean>(true);',
  `const [theme, setTheme] = useState<'light'|'dark'|'system'>(() => {
    return (localStorage.getItem('app-theme') as 'light'|'dark'|'system') || 'system';
  });
  const [isSystemDark, setIsSystemDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && isSystemDark);`
);

code = code.replace(
  `  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);`,
  `  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode, theme]);`
);

code = code.replace(
  `darkMode={darkMode}\n            setDarkMode={setDarkMode}`,
  `darkMode={isDarkMode}\n            setDarkMode={() => {}}` // Header doesn't need to change it anymore
);

code = code.replace(
  `          onOpenFindMess={() => { toast.info("Opening Find Mess Modal"); setIsFindMessOpen(true); }}`,
  `          onOpenFindMess={() => { toast.info("Opening Find Mess Modal"); setIsFindMessOpen(true); }}\n          theme={theme}\n          onThemeChange={setTheme}`
);

fs.writeFileSync('src/App.tsx', code);
