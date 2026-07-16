const fs = require('fs');
let code = fs.readFileSync('src/components/JobRegisterTab.tsx', 'utf8');

const oldFetchCode = `      if (cycleType === "20-20") {
        const { start, end } = getCycleDates();
        query = query.gte("date", start).lte("date", end);
      } else {
        const currentMonth = date.substring(0, 7); // YYYY-MM
        query = query.like("date", \`\${currentMonth}%\`);
      }`;

const newFetchCode = `      if (cycleType === "20-20") {
        const { start, end } = getCycleDates();
        query = query.gte("date", start).lte("date", end);
      } else {
        const currentYear = parseInt(date.substring(0, 4));
        const currentMonth = parseInt(date.substring(5, 7)) - 1;
        const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1)).toISOString().split("T")[0];
        const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).toISOString().split("T")[0];
        query = query.gte("date", startOfMonth).lte("date", endOfMonth);
      }`;

code = code.replace(oldFetchCode, newFetchCode);
fs.writeFileSync('src/components/JobRegisterTab.tsx', code);
