const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const replacement = `
  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome for Android or Desktop.");
      return;
    }

    try {
      // Explicitly request microphone permission to force the prompt if needed
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("মাইক্রোফোন পারমিশন ব্লক করা আছে!\\n\\n১. Address bar এর lock আইকনে ক্লিক করে মাইক্রোফোন Allow করুন।\\n২. আপনি যদি Messenger বা Facebook অ্যাপের ভেতরে থাকেন, তবে 'Open in Chrome' করুন।\\n৩. ফোনের 'Google' অ্যাপের মাইক্রোফোন পারমিশন Allow করা আছে কিনা চেক করুন।");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
`;

code = code.replace(/const handleVoiceInput = \(\) => \{\n    if \(!\("webkitSpeechRecognition" in window\) && !\("SpeechRecognition" in window\)\) \{\n      alert\("Your browser does not support Speech Recognition\. Please use Chrome for Android or Desktop\."\);\n      return;\n    \}\n\n    const SpeechRecognition = \(window as any\)\.webkitSpeechRecognition \|\| \(window as any\)\.SpeechRecognition;/, replacement.trim());

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
