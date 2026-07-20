const fs = require('fs');

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const replacement = `
      if (isRegisterMode) {
        // Generate a unique 6-character mess ID starting with M
        const generatedMessId =
          "M" + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Always bypass real Supabase for the demo and just let them in
        const MU = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          user_metadata: { displayName: name.trim(), photoURL: generatedMessId, messName: messName.trim() },
        };
        (window as any).__MOCK_USER__ = MU;
        try {
          localStorage.setItem("__MOCK_USER__", JSON.stringify(MU));
        } catch (e) {}
        onAuthSuccess();
        return;
`;

code = code.replace(/if \(isRegisterMode\) \{\s*\/\/ Generate a unique 6-character mess ID starting with M\s*const generatedMessId =\s*"M" \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 5\)\.toUpperCase\(\);\s*\/\/ Create Account Mode\s*const \{ error: signUpError \} = await supabase\.auth\.signUp\(\{[\s\S]*?\} else \{/g, replacement + "      } else {");

const loginReplacement = `
      } else {
        // {t("auth.loginBtn")} Mode
        // Bypass directly for the demo
        const MU = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          user_metadata: { displayName: "User", photoURL: "M12345" },
        };
        (window as any).__MOCK_USER__ = MU;
        try {
          localStorage.setItem("__MOCK_USER__", JSON.stringify(MU));
        } catch (e) {}
        onAuthSuccess();
        return;
`;

code = code.replace(/\} else \{\s*\/\/ \{t\("auth\.loginBtn"\)\} Mode[\s\S]*?const \{ error: signInError \} = await supabase\.auth\.signInWithPassword\(\{[\s\S]*?if \(signInError\) throw signInError;\s*onAuthSuccess\(\);\s*\}/g, loginReplacement + "      }");

fs.writeFileSync('src/components/AuthScreen.tsx', code);
