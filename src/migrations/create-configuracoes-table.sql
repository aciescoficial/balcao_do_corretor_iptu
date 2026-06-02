
-- Criação da tabela de configurações
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo VARCHAR(50) NOT NULL UNIQUE,
  configuracoes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adiciona índice para buscas rápidas por tipo
CREATE INDEX IF NOT EXISTS idx_configuracoes_tipo ON public.configuracoes (tipo);

-- Insere configuração padrão para reCAPTCHA se não existir
INSERT INTO public.configuracoes (tipo, configuracoes)
VALUES (
  'recaptcha',
  '{"siteKey": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", "secretKey": "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe", "enabled": true, "threshold": 0.5}'::jsonb
)
ON CONFLICT (tipo) DO NOTHING;
