const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('document.documentElement.classList')) {
  // Add an effect to toggle the class
  const effectCode = `  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
`;
  
  code = code.replace(
    '  const [darkMode, setDarkMode] = useState<boolean>(true);',
    '  const [darkMode, setDarkMode] = useState<boolean>(true);\n\n' + effectCode
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
