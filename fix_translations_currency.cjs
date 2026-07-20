const fs = require('fs');
let code = fs.readFileSync('src/i18n/translations.ts', 'utf8');

const getCurrency = (lang) => {
    switch(lang) {
        case 'en': return '$';
        case 'bn': return '৳';
        case 'hi': return '₹';
        case 'ar': return 'ر.س';
        default: return '৳';
    }
}

// Just globally replace ৳ in the en section
code = code.replace(/"en":\s*\{([\s\S]*?)\},\s*"bn"/, (match, p1) => {
    return '"en": {' + p1.replace(/৳/g, '$') + '},\n  "bn"';
});

code = code.replace(/"hi":\s*\{([\s\S]*?)\}\s*};/, (match, p1) => {
    return '"hi": {' + p1.replace(/৳/g, '₹') + '}\n};';
});

code = code.replace(/"ar":\s*\{([\s\S]*?)\},\s*"hi"/, (match, p1) => {
    return '"ar": {' + p1.replace(/৳/g, 'ر.س') + '},\n  "hi"';
});

// Also add "currency": "..." to common section or just let them use the hook
// It's probably better to add it to each language at the root
code = code.replace(/"en":\s*\{/, '"en": {\n    "currency": "$",');
code = code.replace(/"bn":\s*\{/, '"bn": {\n    "currency": "৳",');
code = code.replace(/"ar":\s*\{/, '"ar": {\n    "currency": "ر.س",');
code = code.replace(/"hi":\s*\{/, '"hi": {\n    "currency": "₹",');

fs.writeFileSync('src/i18n/translations.ts', code);
