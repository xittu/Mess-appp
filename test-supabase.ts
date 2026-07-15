import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jghhyktoncegclmwpvgy.supabase.co";
const supabaseAnonKey = "sb_publishable_5scwN36vjZsJ9Nx8iY6R7g_JNBs-ivO";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from("mess_data").select("*").eq("user_email", "global_config");
  console.log("Fetch:", data, error);
}
test();
