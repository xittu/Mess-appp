const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldRealtime = `        (payload) => {
          // Re-fetch all active notices when a change happens
          supabase
            .from("notices")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                setGlobalNotices(data);
                setShowNoticePopup(true);
              } else {
                setGlobalNotices([]);
                setShowNoticePopup(false);
              }
            });
        }`;

const newRealtime = `        (payload) => {
          // Re-fetch all active notices when a change happens
          supabase
            .from("notices")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                setGlobalNotices(data);
                if (payload.eventType === 'INSERT') {
                  setShowNoticePopup(true);
                }
              } else {
                setGlobalNotices([]);
                setShowNoticePopup(false);
              }
            });
        }`;

code = code.replace(oldRealtime, newRealtime);
fs.writeFileSync('src/App.tsx', code);
