import { createClient } from "@supabase/supabase-js";

// Taking credentials from environment variables as requested in Step 3,
// and using Step 2's provided keys as default fallbacks so it works immediately.
const supabaseUrl =
  (import.meta as any).env.VITE_SUPABASE_URL ||
  "https://jghhyktoncegclmwpvgy.supabase.co";
const supabaseAnonKey =
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_5scwN36vjZsJ9Nx8iY6R7g_JNBs-ivO";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
