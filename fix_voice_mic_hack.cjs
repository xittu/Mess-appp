const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const updated = `
  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome for Android or Desktop.");
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("getUserMedia error:", err);
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.continuous = false;
    recognition.interimResults = false;
`;

code = code.replace(/const handleVoiceInput = \(\) => \{[\s\S]*?recognition\.interimResults = false;/, updated.trim());

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
