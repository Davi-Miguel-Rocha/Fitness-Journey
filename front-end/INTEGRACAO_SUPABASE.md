# Integração com Supabase - Fitness Journey

## ✅ O que foi implementado

### 1. Autenticação Completa
- **LoginScreen**: Integrado com Supabase Auth
- **SignUpScreen**: Cadastro de novos usuários
- **AuthContext**: Contexto React para gerenciar estado de autenticação
- **MenuScreen**: Tela principal após login

### 2. Navegação Automática
- SplashScreen sempre exibido primeiro
- Navegação automática para Login após splash (mesmo com sessão ativa)
- Navegação automática para Menu após login bem-sucedido
- Navegação automática para Login após logout

### 3. Gerenciamento de Perfil
- Salvamento de dados adicionais na tabela `profiles`
- Carregamento de perfil na tela Menu
- Upload de foto de perfil (galeria ou câmera)
- Tratamento de erros caso a tabela não exista

## 📋 Configuração Necessária

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na pasta `front-end` com:

```
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Criar Tabela no Supabase
Execute o script SQL em `supabase-setup.sql` no SQL Editor do Supabase:

1. Acesse o painel do Supabase
2. Vá em "SQL Editor"
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Execute o script

Isso criará:
- Tabela `profiles` com as colunas necessárias
- Políticas RLS (Row Level Security)
- Triggers para atualização automática de `updated_at`

### 3. Configurar Email (Opcional)
No painel do Supabase:
- Vá em "Authentication" → "Settings"
- Configure o email provider
- Ajuste as configurações de confirmação de email conforme necessário

## 🚀 Como Usar

### Login
1. Abra o app (SplashScreen será exibido primeiro)
2. Digite email e senha
3. Após login bem-sucedido, será redirecionado automaticamente para Menu

### Cadastro
1. Na tela de Login, clique em "Não tem uma conta? Crie aqui."
2. Preencha todos os campos
3. Após cadastro, verifique seu email para confirmar a conta
4. Faça login normalmente

### Logout
1. Na tela Menu, clique no botão "Sair"
2. Confirme a ação
3. Será redirecionado automaticamente para a tela de Login

## 📁 Estrutura de Arquivos

```
front-end/
├── contexts/
│   └── AuthContext.js          # Contexto de autenticação
├── screens/
│   ├── App.js                  # Navegação principal
│   ├── SplashScreen.js         # Tela de carregamento inicial
│   ├── LoginScreen.js          # Tela de login
│   ├── SingUp.js               # Tela de cadastro
│   ├── MenuScreen.js           # Tela principal (após login)
│   ├── SetGoalScreen.js        # Tela para definir meta diária
│   └── StepCounterScreen.js    # Tela do contador de passos
├── components/
│   └── StepCounter.js          # Componente do contador de passos
├── lib/
│   └── supabase.js            # Configuração do Supabase
├── supabase-setup.sql         # Script SQL para criar tabela
└── supabase-diagnostic.sql    # Script SQL para diagnóstico
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado na tabela `profiles`
- Usuários só podem acessar seus próprios dados
- Senhas são armazenadas de forma segura pelo Supabase
- Tokens de autenticação gerenciados automaticamente

## ⚠️ Notas Importantes

1. **Tabela profiles**: Se a tabela não existir, o cadastro ainda funcionará, mas os dados adicionais (nome, sobrenome, idade) não serão salvos.

2. **Confirmação de Email**: Por padrão, o Supabase pode exigir confirmação de email. Você pode desabilitar isso nas configurações do Supabase.

3. **Sessão Persistente**: O app mantém a sessão do usuário mesmo após fechar o app, graças ao AsyncStorage.

## 🐛 Troubleshooting

### Erro: "Tabela profiles não encontrada"
- Execute o script SQL em `supabase-setup.sql`

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas no arquivo `.env`

### Usuário não é redirecionado após login
- Verifique se o AuthContext está envolvendo o app corretamente
- Verifique o console para erros

### Email não é enviado
- Verifique as configurações de email no painel do Supabase
- Verifique a pasta de spam

