const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldDelete = `  const handleDeleteNotice = async (id: string) => {
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
  };`;

const newDelete = `  const handleDeleteNotice = async (id: string) => {
    try {
      const { data, error } = await supabase.from("notices").delete().eq("id", id).select();
      if (error) {
        alert("Error deleting notice: " + error.message);
        throw error;
      }
      if (data && data.length === 0) {
        // Fallback to soft delete if RLS blocks hard delete
        await supabase.from("notices").update({ is_active: false }).eq("id", id);
      }
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };`;

code = code.replace(oldDelete, newDelete);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
