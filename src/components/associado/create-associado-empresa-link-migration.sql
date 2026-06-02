
-- Add columns to profiles table for linking users to associados and empresas
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS associado_id UUID REFERENCES associados(id),
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id),
ADD COLUMN IF NOT EXISTS email TEXT;
