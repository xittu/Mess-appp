const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://jghhyktoncegclmwpvgy.supabase.co";
const supabaseAnonKey = "sb_publishable_5scwN36vjZsJ9Nx8iY6R7g_JNBs-ivO";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function run() {
  const { data, error } = await supabase.from('notices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log("Delete attempt:", error);
}
run();
