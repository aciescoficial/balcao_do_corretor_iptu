
-- Remove reCAPTCHA configuration if it exists
DELETE FROM public.configuracoes WHERE tipo = 'recaptcha';

-- Disable captcha requirement in auth settings
UPDATE auth.config 
SET enable_signup_captcha = false,
    enable_email_signup_captcha = false,
    enable_phone_signup_captcha = false;

-- IMPORTANT: Make sure email confirmation is not required for new users
UPDATE auth.config 
SET enable_confirmations = false;

-- Update or insert the system setting for email confirmation
INSERT INTO public.system_config (key, value, description)
VALUES (
  'auth.require_email_confirmation',
  'false', 
  'Determina se é necessário confirmar o e-mail para login'
)
ON CONFLICT (key) 
DO UPDATE SET value = 'false';
