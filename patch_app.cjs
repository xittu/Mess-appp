const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const noticeFetchCode = `      // Fetch global notices from notices table
      try {
        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (noticesData && noticesData.length > 0) {
           setGlobalNotices(noticesData);
           setShowNoticePopup(true);
        }
      } catch (err) {
        console.error("Failed to load global notices", err);
      }`;

code = code.replace(
  /\/\/ Fetch global notices from admin record[\s\S]*?console\.error\(\"Failed to load global notices\", err\);\n      \}/m,
  noticeFetchCode
);

const subscriptionCode = `  // --- Real-time Notices Subscription ---
  useEffect(() => {
    const channel = supabase
      .channel('public:notices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        (payload) => {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);`;

code = code.replace(
  '// --- Auth Observer ---',
  subscriptionCode + '\n\n  // --- Auth Observer ---'
);

fs.writeFileSync('src/App.tsx', code);
