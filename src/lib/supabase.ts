import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;
let lastUrl: string | null = null;
let lastKey: string | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  try {
    const url = "https://plwqkwpzklexlxaatfjb.supabase.co";
    const key = "sb_publishable_5scwN36vjZsJ9Nx8iY6R7g_JNBs-ivO";
    
    if (!supabaseInstance || lastUrl !== url || lastKey !== key) {
      supabaseInstance = createClient(url, key, {
        global: {
          fetch: (...args) => {
            // Adds a fetch timeout so requests don't hang indefinitely 
            // if the supabase project is paused or offline
            const [resource, config] = args;
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 8000);
            
            const reqConfig = config || {};
            return fetch(resource, {
              ...reqConfig,
              signal: controller.signal
            }).then(response => {
              clearTimeout(id);
              return response;
            }).catch(err => {
              clearTimeout(id);
              throw err;
            });
          }
        }
      });
      lastUrl = url;
      lastKey = key;
    }
    return supabaseInstance;
  } catch (e) {
    console.error("Supabase client init failed:", e);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return true;
}

export function getSupabaseTableName(): string {
  return "Mess-appp";
}

