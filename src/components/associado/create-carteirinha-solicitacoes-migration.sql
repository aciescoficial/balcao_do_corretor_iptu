
-- Create carteirinha_solicitacoes table
CREATE TABLE IF NOT EXISTS carteirinha_solicitacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  associado_id UUID NOT NULL,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  endereco_entrega TEXT NOT NULL,
  complemento TEXT,
  valor NUMERIC NOT NULL DEFAULT 15.00,
  status TEXT NOT NULL DEFAULT 'pendente_pagamento',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pagamento_id TEXT,
  codigo_rastreio TEXT,
  observacoes TEXT,
  email TEXT
);

-- Add RLS policies
ALTER TABLE carteirinha_solicitacoes ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY "Admins have full control" 
  ON carteirinha_solicitacoes 
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Users can only read their own solicitations
CREATE POLICY "Users can view their own solicitations" 
  ON carteirinha_solicitacoes 
  FOR SELECT 
  USING (associado_id IN (
    SELECT a.id FROM associados a WHERE a.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

-- Users can create solicitations
CREATE POLICY "Users can create solicitations" 
  ON carteirinha_solicitacoes 
  FOR INSERT 
  WITH CHECK (true);
