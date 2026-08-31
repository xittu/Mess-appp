-- Create user_locations table to track coordinates
CREATE TABLE IF NOT EXISTS public.user_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Allow users to insert/update their own location
CREATE POLICY "Users can insert their own location" ON public.user_locations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own location" ON public.user_locations FOR UPDATE USING (auth.uid() = user_id);
-- Allow everyone to read locations (so they can find near messes)
CREATE POLICY "Anyone can read locations" ON public.user_locations FOR SELECT USING (true);

-- Create mess_requests table for connect requests
CREATE TABLE IF NOT EXISTS public.mess_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

-- Enable RLS
ALTER TABLE public.mess_requests ENABLE ROW LEVEL SECURITY;

-- Policies for requests
CREATE POLICY "Users can create requests" ON public.mess_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can view their own sent and received requests" ON public.mess_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Receiver can update request status" ON public.mess_requests FOR UPDATE USING (auth.uid() = receiver_id);

-- Create ephemeral_chats table
CREATE TABLE IF NOT EXISTS public.ephemeral_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ephemeral_chats ENABLE ROW LEVEL SECURITY;

-- Policies for chats
CREATE POLICY "Users can insert their own messages" ON public.ephemeral_chats FOR INSERT WITH CHECK (auth.uid() = sender_id);
-- Users can only read messages where they are sender or receiver, AND created_at is within the last 12 hours
CREATE POLICY "Users can read their 12h chats" ON public.ephemeral_chats FOR SELECT USING (
    (auth.uid() = sender_id OR auth.uid() = receiver_id)
    AND created_at > (NOW() - INTERVAL '12 hours')
);

-- Function to clean up old messages (optional, to save space)
-- It deletes messages older than 12 hours. Can be called manually or by pg_cron if enabled.
CREATE OR REPLACE FUNCTION delete_old_chats() RETURNS void AS $$
BEGIN
  DELETE FROM public.ephemeral_chats WHERE created_at < NOW() - INTERVAL '12 hours';
END;
$$ LANGUAGE plpgsql;

