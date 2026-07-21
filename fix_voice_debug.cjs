const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const updatedHandlers = `
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceSuccessMessage("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      parseTranscript(transcript);
    };

    recognition.onnomatch = () => {
      setIsListening(false);
      alert("No speech recognized. Please try again.");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("মাইক্রোফোন পারমিশন ব্লক করা আছে!\\n\\n১. Address bar এর lock আইকনে ক্লিক করে মাইক্রোফোন Allow করুন।\\n২. আপনি যদি Messenger বা Facebook অ্যাপের ভেতরে থাকেন, তবে 'Open in Chrome' করুন।\\n৩. ফোনের 'Google' অ্যাপের মাইক্রোফোন পারমিশন Allow করা আছে কিনা চেক করুন।");
      } else if (event.error === 'no-speech') {
        alert("কোনো কথা শোনা যায়নি। দয়া করে আবার চেষ্টা করুন। (No speech detected)");
      } else {
        alert("Error recognizing speech: " + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };
`;

code = code.replace(/recognition\.onstart = \(\) => \{[\s\S]*?recognition\.onend = \(\) => \{\n      setIsListening\(false\);\n    \};/, updatedHandlers.trim());

// Also fix the ${currencySymbol} bug in VoicePreviewModal
code = code.replace(/\$\{currencySymbol\}/g, '{currencySymbol}');

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
