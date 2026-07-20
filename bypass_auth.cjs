const fs = require('fs');

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const newCode = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (isRegisterMode && !name.trim()) {
      setErrorMsg(t("auth.name") + " is required.");
      return;
    }
    if (isRegisterMode && !messName.trim()) {
      setErrorMsg("Mess name is required.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (isRegisterMode && !agreeTerms) {
      setErrorMsg("Please agree to terms and conditions.");
      return;
    }
    
    setLoading(true);
    try {
      if (isRegisterMode) {
        const generatedMessId = "M" + Math.random().toString(36).substr(2, 5).toUpperCase();
        const MU = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          user_metadata: { displayName: name.trim() || "User", photoURL: generatedMessId, messName: messName.trim() },
        };
        (window as any).__MOCK_USER__ = MU;
        try { localStorage.setItem("__MOCK_USER__", JSON.stringify(MU)); } catch(e) {}
        onAuthSuccess();
      } else {
        const MU = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          user_metadata: { displayName: "Demo User", photoURL: "M12345", messName: "Demo Mess" },
        };
        (window as any).__MOCK_USER__ = MU;
        try { localStorage.setItem("__MOCK_USER__", JSON.stringify(MU)); } catch(e) {}
        onAuthSuccess();
      }
    } catch(err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (`;

code = code.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?return \(/, newCode);

fs.writeFileSync('src/components/AuthScreen.tsx', code);
