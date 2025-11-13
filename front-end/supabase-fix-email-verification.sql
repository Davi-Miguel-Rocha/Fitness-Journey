-- Script SQL para marcar TODOS os emails como verificados
-- Execute este script no SQL Editor do Supabase
-- 
-- IMPORTANTE: Antes de executar este script, desabilite a confirmação de email no painel:
-- 1. Acesse o painel do Supabase
-- 2. Vá em "Authentication" → "Settings"
-- 3. Desabilite "Enable email confirmations"
-- 4. Salve as alterações
-- 5. Execute este script

-- Marcar TODOS os emails como verificados (para usuários existentes)
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, created_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Criar ou atualizar função para marcar emails como verificados automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Marcar email como verificado automaticamente quando um novo usuário é criado
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verificar quantos usuários têm email não confirmado (deve retornar 0 após executar)
SELECT 
  COUNT(*) as usuarios_sem_email_confirmado
FROM auth.users
WHERE email_confirmed_at IS NULL;

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_new_user() IS 'Função para marcar emails como verificados automaticamente no cadastro';

