const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Modify the initial fetch to get notices from 'notices' table
const fetchCode = `        // Fetch notices
        const { data: noticesData } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
        if (noticesData) {
          setNotices(noticesData);
        }`;

code = code.replace(
  /if \(adminData \&\& adminData\.expenses \&\& adminData\.expenses\.notices\) \{[\s\S]*?setNotices\(adminData\.expenses\.notices\);\n          \}/m,
  fetchCode
);

// We need to overwrite the whole saveAdminNotices function, handleAddNotice, handleDeleteNotice, handleToggleNotice
const noticeFunctions = `  const handleAddNotice = async () => {
    if (!newNoticeMessage.trim()) return;
    setSavingNotice(true);
    try {
      const { data, error } = await supabase.from("notices").insert([{
        title: "Admin Notice",
        content: newNoticeMessage.trim(),
        is_active: true
      }]).select();
      
      if (error) {
        alert("Error adding notice: " + error.message);
        throw error;
      }
      
      if (data) {
        setNotices([data[0], ...notices]);
      }
      setNewNoticeMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) {
        alert("Error deleting notice: " + error.message);
        throw error;
      }
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleNotice = async (id: string) => {
    const notice = notices.find(n => n.id === id);
    if (!notice) return;
    
    try {
      const { error } = await supabase.from("notices").update({ is_active: !notice.is_active }).eq("id", id);
      if (error) {
        alert("Error updating notice: " + error.message);
        throw error;
      }
      setNotices(notices.map(n => n.id === id ? { ...n, is_active: !notice.is_active } : n));
    } catch (err) {
      console.error(err);
    }
  };`;

// replace saveAdminNotices and all handlers
code = code.replace(
  /const saveAdminNotices = async \(newNotices: Notice\[\]\) => \{[\s\S]*?saveAdminNotices\(notices\.map\(n => n\.id === id \? \{ \.\.\.n, isActive: !n\.isActive \} : n\)\);\n  \};/m,
  noticeFunctions
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
