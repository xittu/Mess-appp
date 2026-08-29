const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const correctSubmit = `
    setLoading(true);
    try {
      if (isRegisterMode) {
        // Create Account Mode
        const generatedMessId = "M" + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              displayName: name.trim(),
              photoURL: generatedMessId,
              messName: messName.trim(),
            },
          },
        });
        if (signUpError) throw signUpError;
        
        // Remove mock user if it exists
        delete (window as any).__MOCK_USER__;
        try { localStorage.removeItem("__MOCK_USER__"); } catch(e) {}
        
        onAuthSuccess();
      } else {
        // Login Mode
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (signInError) throw signInError;
        
        // Remove mock user if it exists
        delete (window as any).__MOCK_USER__;
        try { localStorage.removeItem("__MOCK_USER__"); } catch(e) {}
        
        onAuthSuccess();
      }
    } catch(err: any) {
`;

code = code.replace(/setLoading\(true\);\s*try \{\s*if \(isRegisterMode\) \{[\s\S]*?\} catch\(err: any\) \{/, correctSubmit);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
