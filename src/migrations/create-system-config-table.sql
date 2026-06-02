
-- Create system_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_config (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for system_config
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for system_config
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.system_config;
DROP POLICY IF EXISTS "Enable insert/update for admins" ON public.system_config;

CREATE POLICY "Enable read for authenticated users" 
ON public.system_config
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert/update for admins" 
ON public.system_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert default system_config values if they don't exist
INSERT INTO public.system_config (key, value)
VALUES ('SHOW_SYSTEM_MESSAGES', 'true')
ON CONFLICT (key) DO NOTHING;
