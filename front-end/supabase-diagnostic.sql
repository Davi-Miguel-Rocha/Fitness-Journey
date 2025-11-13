-- Script de Diagnóstico para a tabela profiles
-- Execute este script no SQL Editor do Supabase para verificar a configuração

-- 1. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS table_exists;

-- 2. Verificar estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Verificar se RLS está habilitado
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 4. Verificar políticas RLS existentes
SELECT 
  policyname, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 5. Verificar se há dados na tabela (apenas para admin)
SELECT COUNT(*) as total_profiles FROM profiles;

-- 6. Verificar triggers
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table = 'profiles';

