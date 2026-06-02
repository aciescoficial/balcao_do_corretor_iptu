
-- Fix existing RLS policy for user table to allow regular signups
DROP POLICY IF EXISTS "Allow inserts during signup" ON public.user;

-- Create a more permissive policy that allows regular user creation
-- but restricts creation of admin and diretoria accounts
CREATE POLICY "Allow regular user creation" 
ON public.user 
FOR INSERT 
WITH CHECK (
  -- Users can only create 'user' or 'empresa' role accounts
  (role = 'user' OR role = 'empresa')
  
  -- OR if the insert is coming from an admin user
  OR EXISTS (
    SELECT 1
    FROM public.user
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create policy for self-registration - enable account creation
-- but limit the roles that can be created by non-admin users
CREATE POLICY "Limit role creation by type"
ON public.user
FOR INSERT
WITH CHECK (
  CASE 
    -- If the current user is an admin, allow creating any role
    WHEN EXISTS (
      SELECT 1 FROM public.user 
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN true
    
    -- If this is a signup (no authenticated user), only allow user/empresa roles
    WHEN auth.uid() IS NULL AND (role = 'user' OR role = 'empresa') THEN true
    
    -- Otherwise deny
    ELSE false
  END
);

-- Update admin user privileges
CREATE POLICY "Admin users can manage all users" 
ON public.user
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user
  WHERE id = auth.uid() AND role = 'admin'
));
