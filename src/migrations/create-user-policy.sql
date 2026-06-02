
-- Enable RLS on the user table
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can view their own data" 
ON public.user 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy for admin users to read all data
CREATE POLICY "Admin users can read all users" 
ON public.user 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policy for admin users to manage all users
CREATE POLICY "Admin users can manage users" 
ON public.user 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create policy for self-updates
CREATE POLICY "Users can update their own data" 
ON public.user 
FOR UPDATE 
USING (auth.uid() = id);

-- Very important: allow the application to insert new users during signup
-- This is needed for the registration process to work
CREATE POLICY "Allow inserts during signup" 
ON public.user 
FOR INSERT 
WITH CHECK (true);

-- Create default admin user if not exists
INSERT INTO public.user (id, name, email, role, active)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  'Admin', 
  'admin@example.com', 
  'admin'::user_role, 
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user WHERE role = 'admin'
);
