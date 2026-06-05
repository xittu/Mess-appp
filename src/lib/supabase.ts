import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jghhyktoncegclmwpvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaGh5a3RjbmNlZ2NsbXdwdmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODE3NzgsImV4cCI6MjA5NjA1Nzc3OH0.ccJcKhyaY6Gb6wY3METHR7VO7aWvPUMDedwlhGrZzng";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return true;
}

export function getSupabaseTableName(): string {
  return "Mess-appp";
}
