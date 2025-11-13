-- Script SQL para desabilitar confirmação de email no Supabase
-- Execute este script no SQL Editor do Supabase
-- 
-- NOTA: A confirmação de email também precisa ser desabilitada no painel do Supabase:
-- 1. Acesse o painel do Supabase
-- 2. Vá em "Authentication" → "Settings"
-- 3. Desabilite "Enable email confirmations"
-- 4. Salve as alterações

-- Atualizar configurações de autenticação para não exigir confirmação de email
-- Isso atualiza a configuração do auth.users para marcar emails como verificados automaticamente

-- Função para marcar todos os emails como verificados (para usuários existentes)
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, created_at)
WHERE email_confirmed_at IS NULL;

-- Criar ou atualizar função para marcar emails como verificados automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Marcar email como verificado automaticamente
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_new_user() IS 'Função para marcar emails como verificados automaticamente no cadastro';

