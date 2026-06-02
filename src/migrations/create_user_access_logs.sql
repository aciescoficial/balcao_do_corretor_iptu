
-- Create table for tracking user access and activity logs
CREATE TABLE IF NOT EXISTS public.user_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  is_login BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_access_logs_user_id ON public.user_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_logs_created_at ON public.user_access_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own logs
CREATE POLICY IF NOT EXISTS "Users can view their own access logs"
ON public.user_access_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy that allows admins to view all logs
CREATE POLICY IF NOT EXISTS "Admins can view all access logs"
ON public.user_access_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user
    WHERE id = auth.uid() AND role IN ('admin', 'diretoria')
  )
);

-- Ensure the service role can insert logs
CREATE POLICY IF NOT EXISTS "Service role can insert logs"
ON public.user_access_logs
FOR INSERT
WITH CHECK (true);

-- Add new columns to user table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'city') THEN
    ALTER TABLE public.user ADD COLUMN city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'state') THEN
    ALTER TABLE public.user ADD COLUMN state TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'cpf') THEN
    ALTER TABLE public.user ADD COLUMN cpf TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'creci') THEN
    ALTER TABLE public.user ADD COLUMN creci TEXT;
  END IF;
END
$$;

-- Update user_role type to include 'diretoria' if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = 'user_role' AND
      n.nspname = 'public' AND
      'diretoria' = ANY(enum_range(NULL::public.user_role)::text[])) THEN
      
    ALTER TYPE public.user_role ADD VALUE 'diretoria';
  END IF;
END
$$;

-- Add is_login column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_access_logs' AND column_name = 'is_login') THEN
    ALTER TABLE public.user_access_logs ADD COLUMN is_login BOOLEAN DEFAULT false;
  END IF;
END
$$;

