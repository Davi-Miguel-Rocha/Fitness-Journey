-- Script SQL para limpar TODOS os dados do banco de dados
-- Mantém a estrutura das tabelas e políticas RLS
-- Execute este script no SQL Editor do Supabase

-- ⚠️ ATENÇÃO: Este script irá DELETAR TODOS OS DADOS!
-- Use apenas se tiver certeza de que deseja limpar o banco de dados

-- 1. Limpar dados da tabela profiles
TRUNCATE TABLE profiles CASCADE;

-- 2. Limpar todos os usuários do Supabase Auth
-- Nota: Isso requer permissões de admin. Execute no painel do Supabase:
-- Authentication > Users > Delete All (ou delete individualmente)

-- 3. Verificar se há outras tabelas que precisam ser limpas
-- Se você criou outras tabelas, adicione comandos TRUNCATE aqui

-- Exemplo de limpeza de outras tabelas (descomente se necessário):
-- TRUNCATE TABLE nome_da_tabela CASCADE;

-- 4. Verificar se os dados foram removidos
SELECT COUNT(*) as total_profiles FROM profiles;

-- Após executar este script:
-- - A estrutura das tabelas será mantida
-- - As políticas RLS serão mantidas
-- - Os triggers serão mantidos
-- - Apenas os DADOS serão removidos

-- Para recriar a estrutura completa (se necessário), execute o script supabase-setup.sql

