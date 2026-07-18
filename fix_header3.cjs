const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// The array got deleted. I will put it right after `const { language, setLanguage, t } = useLanguage();`
const arrayDef = `
  const MONTH_DETAILS = [
    { id: "January 2026", enShort: "JAN", bnFull: t("header.jan"), bnShort: t("header.janShort") },
    { id: "February 2026", enShort: "FEB", bnFull: t("header.feb"), bnShort: t("header.febShort") },
    { id: "March 2026", enShort: "MAR", bnFull: t("header.mar"), bnShort: t("header.marShort") },
    { id: "April 2026", enShort: "APR", bnFull: t("header.apr"), bnShort: t("header.aprShort") },
    { id: "May 2026", enShort: "MAY", bnFull: t("header.may"), bnShort: t("header.mayShort") },
    { id: "June 2026", enShort: "JUN", bnFull: t("header.jun"), bnShort: t("header.junShort") },
    { id: "July 2026", enShort: "JUL", bnFull: t("header.jul"), bnShort: t("header.julShort") },
    { id: "August 2026", enShort: "AUG", bnFull: t("header.aug"), bnShort: t("header.augShort") },
    { id: "September 2026", enShort: "SEP", bnFull: t("header.sep"), bnShort: t("header.sepShort") },
    { id: "October 2026", enShort: "OCT", bnFull: t("header.oct"), bnShort: t("header.octShort") },
    { id: "November 2026", enShort: "NOV", bnFull: t("header.nov"), bnShort: t("header.novShort") },
    { id: "December 2026", enShort: "DEC", bnFull: t("header.dec"), bnShort: t("header.decShort") },
  ];
`;

code = code.replace(/const \{ language, setLanguage, t \} = useLanguage\(\);/g, 'const { language, setLanguage, t } = useLanguage();' + arrayDef);

fs.writeFileSync('src/components/Header.tsx', code);
