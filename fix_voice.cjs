const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const updated = `
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome for Android or Desktop.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
`;

code = code.replace(/const handleVoiceInput = async \(\) => \{[\s\S]*?recognition\.lang = "bn-BD";/, updated.trim());

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
