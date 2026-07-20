const fs = require('fs');

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const newHandleSubmit = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode && !name.trim()) {
      setErrorMsg("অনুগ্রহ করে আপনার নামটি লিখুন।");
      return;
    }
    if (isRegisterMode && !messName.trim()) {
      setErrorMsg("অনুগ্রহ করে হোস্টেল বা মেসের নাম লিখুন।");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg("অনুগ্রহ করে সঠিক ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (isRegisterMode && !agreeTerms) {
      setErrorMsg("এগিয়ে যাওয়ার জন্য অনুগ্রহ করে ব্যবহারের শর্তাবলীতে সম্মতি দিন।");
      return;
    }

    try {
      setLoading(true);

      if (isRegisterMode) {
        const generatedMessId = "M" + Math.random().toString(36).substr(2, 5).toUpperCase();
        const MU = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email: email.trim(),
          user_metadata: { displayName: name.trim(), photoURL: generatedMessId, messName: messName.trim() },
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
    } catch (err: any) {
      setErrorMsg(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };
`;

code = code.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\};(\s*\/\/ --- Resend Email ---)/, newHandleSubmit.trim() + "$1");

fs.writeFileSync('src/components/AuthScreen.tsx', code);
