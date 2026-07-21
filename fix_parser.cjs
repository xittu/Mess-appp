const fs = require('fs');

let code = fs.readFileSync('src/components/ExpensesTab.tsx', 'utf8');

const newParser = `
  const parseTranscript = (transcript: string) => {
    // Convert Bengali digits to English
    const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => "0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);
    const normalized = bnToEn(transcript);
    
    console.log("Speech recognized:", transcript, "Normalized:", normalized);

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
    
    alert(\`Could not parse properly from: "\${transcript}". Please try saying an amount and item, e.g. "40 taka alu" or "Alu 40"\`);
  };
`;

code = code.replace(/const parseTranscript = \(transcript: string\) => \{[\s\S]*?\n  };\n/, newParser.trim() + "\n\n");

fs.writeFileSync('src/components/ExpensesTab.tsx', code);
