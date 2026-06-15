const fs = require('fs');

function replaceFiles() {
  let authScreen = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');
  
  // Replace direct window assignments
  authScreen = authScreen.replace(
    /\(window as any\)\.__MOCK_USER__ = (\{.*?\});/g,
    `const MU = $1; (window as any).__MOCK_USER__ = MU; try { localStorage.setItem('__MOCK_USER__', JSON.stringify(MU)); } catch(e) {}`
  );
  authScreen = authScreen.replace(
    /let (.*?) = \(window as any\)\.__MOCK_USER__;/g,
    `let $1 = (window as any).__MOCK_USER__ || JSON.parse(localStorage.getItem('__MOCK_USER__') || 'null');`
  );

  fs.writeFileSync('src/components/AuthScreen.tsx', authScreen);

  let appFile = fs.readFileSync('src/App.tsx', 'utf8');

  // Insert getMockUser function at top of App component
  appFile = appFile.replace(
    /export default function App\(\) \{/,
    `export default function App() {\n  const getMockUser = () => {\n    if ((window as any).__MOCK_USER__) return (window as any).__MOCK_USER__;\n    try { return JSON.parse(localStorage.getItem('__MOCK_USER__') || 'null'); } catch(e) { return null; }\n  };\n`
  );

  // Replace occurrences of (window as any).__MOCK_USER__ with getMockUser()
  appFile = appFile.replace(/\(window as any\)\.__MOCK_USER__/g, 'getMockUser()');
  
  // Revert the reset behavior for logout
  appFile = appFile.replace(/getMockUser\(\) = null;/g, `(window as any).__MOCK_USER__ = null; localStorage.removeItem('__MOCK_USER__');`);

  fs.writeFileSync('src/App.tsx', appFile);
}

replaceFiles();
console.log('done');
