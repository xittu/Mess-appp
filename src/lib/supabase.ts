import { createClient } from "@supabase/supabase-js";

// Hardcoded for Capacitor Android build to prevent missing env variable issues
const supabaseUrl = "https://plwqkwpzklexlxaatfjb.supabase.co";
const supabaseAnonKey = "sb_publishable_5scwN36vjZsJ9Nx8iY6R7g_JNBs-ivO";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
