
-- Criar tabela de pagamentos do associado
CREATE TABLE IF NOT EXISTS public.pagamentos_associado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  associado_id UUID NOT NULL REFERENCES public.associados(id),
  valor NUMERIC NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  metodo TEXT,
  origem TEXT NOT NULL DEFAULT 'manual',
  comprovante_url TEXT,
  descricao TEXT,
  ano_referencia INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar políticas de segurança
ALTER TABLE public.pagamentos_associado ENABLE ROW LEVEL SECURITY;

-- Permitir que administradores vejam e gerenciem todos os pagamentos
CREATE POLICY "Admins podem gerenciar todos os pagamentos" ON public.pagamentos_associado
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public."user"
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Permitir que usuários vejam apenas seus próprios pagamentos
CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON public.pagamentos_associado
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public."user"
    WHERE id = auth.uid() AND associado_id = pagamentos_associado.associado_id
  ));

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_associado_id ON public.pagamentos_associado(associado_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON public.pagamentos_associado(data_pagamento);
