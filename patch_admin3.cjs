const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldStr = `        // Find admin's notices
        const adminData = records.find((r) => r.user_email?.toLowerCase() === "zitu@admin.com" || r.user_email?.toLowerCase() === "admin@mppd7x.com");
        if (adminData && adminData.expenses && adminData.expenses.notices) {
          setNotices(adminData.expenses.notices);
        }`;

const newStr = `        // Fetch notices from 'notices' table
        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false });
        if (noticesData) {
          setNotices(noticesData);
        }`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
