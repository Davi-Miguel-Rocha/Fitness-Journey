# Como Desabilitar Confirmação de Email no Supabase

Para que o cadastro e login funcionem sem verificação de email em 2 etapas, você precisa desabilitar a confirmação de email no painel do Supabase.

## Passos para Desabilitar:

1. **Acesse o painel do Supabase**
   - Vá para https://app.supabase.com
   - Faça login na sua conta

2. **Navegue até as configurações de autenticação**
   - No menu lateral, clique em **"Authentication"**
   - Depois clique em **"Settings"** (ou "Configurações")

3. **Desabilite a confirmação de email**
   - Procure pela opção **"Enable email confirmations"** (ou "Habilitar confirmações de email")
   - **Desmarque** essa opção
   - Role a página para baixo e clique em **"Save"** (ou "Salvar")

4. **Execute o script SQL (opcional, mas recomendado)**
   - No menu lateral, clique em **"SQL Editor"**
   - Abra o arquivo `supabase-disable-email-confirmation.sql`
   - Cole o conteúdo no editor SQL
   - Clique em **"Run"** (ou "Executar")
   - Isso marcará todos os emails existentes como verificados e criará um trigger para fazer isso automaticamente no futuro

## Verificação:

Após desabilitar a confirmação de email:
- Os novos usuários poderão fazer login imediatamente após o cadastro
- Não será necessário confirmar o email antes de fazer login
- O cadastro funcionará sem esperar confirmação de email

## Nota Importante:

Se você já tem usuários cadastrados que não confirmaram o email, execute o script SQL para marcar seus emails como verificados. Caso contrário, eles ainda precisarão confirmar o email para fazer login.

