const fs = require('fs');
let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const advancedParser = `
  const parseTranscript = (transcript: string) => {
    // 1. Convert Bengali digits to English
    const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => "0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);
    let normalized = bnToEn(transcript);
    
    console.log("Speech recognized:", transcript, "Normalized:", normalized);

    // 2. Map some common Bengali number words to digits for better fallback
    const wordToNumber: Record<string, string> = {
      "এক": "1", "দুই": "2", "তিন": "3", "চার": "4", "পাঁচ": "5", "ছয়": "6", "সাত": "7", "আট": "8", "নয়": "9", "দশ": "10",
      "বিশ": "20", "ত্রিশ": "30", "তিরিশ": "30", "চল্লিশ": "40", "পঞ্চাশ": "50", "ষাট": "60", "সত্তর": "70", "আশি": "80", "নব্বই": "90", "একশ": "100", "শ": "100"
    };
    
    // Replace whole words
    Object.keys(wordToNumber).forEach(word => {
      const regex = new RegExp(\`\\\\b\${word}\\\\b\`, 'gi');
      normalized = normalized.replace(regex, wordToNumber[word]);
    });

    // Try to find a number in the transcript
    const numberMatch = normalized.match(/(\\d+(\\.\\d+)?)/);
    
    if (numberMatch) {
      const amount = parseFloat(numberMatch[0]);
      // Remove the number and currency words
      let desc = normalized
        .replace(numberMatch[0], "")
        .replace(/taka|টাকা|Taka|tk|টিক/gi, "")
        .replace(/tar|এর/gi, "") // optional trailing words like "takar"
        .replace(/^[\\s,.]+|[\\s,.]+$/g, "") // trim spaces/punctuation
        .trim();
        
      if (amount > 0) {
        setPendingVoiceItems([{ amount, desc: desc || t("expenses.voiceDefaultDesc") }]);
        setShowVoicePreview(true);
        return;
      }
    }
    
    alert(\`শোনা গেছে: "\${transcript}"\\nকিন্তু কোনো টাকার পরিমাণ বোঝা যায়নি। দয়া করে আবার বলুন, যেমন: "৪০ টাকা আলু"\`);
  };
`;

code = code.replace(/const parseTranscript = \(transcript: string\) => \{[\s\S]*?\n  };\n/, advancedParser.trim() + "\n\n");

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
