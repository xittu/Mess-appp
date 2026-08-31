ALTER TABLE public.user_locations ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT 'Unknown User';
