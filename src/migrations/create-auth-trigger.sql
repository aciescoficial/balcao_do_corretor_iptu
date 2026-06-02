
-- Create a function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."user" (id, name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'), 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    email = NEW.email,
    role = COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
