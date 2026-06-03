import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;
let lastUrl: string | null = null;
let lastKey: string | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = localStorage.getItem("supabase_url") || "";
  const key = localStorage.getItem("supabase_key") || "";

  if (!url || !key) {
    return null;
  }

  // If the credentials haven't changed, return the cached client
  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false
      }
    });
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const url = localStorage.getItem("supabase_url") || "";
  const key = localStorage.getItem("supabase_key") || "";
  return url.length > 0 && key.length > 0;
}
