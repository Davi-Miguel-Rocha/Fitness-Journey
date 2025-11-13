import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Importar AsyncStorage apenas para plataformas nativas
let AsyncStorage;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Importando as variáveis de ambiente
// Nota: Em JS, você acessa as variáveis de ambiente do Expo diretamente
// via 'process.env' no código.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validação das variáveis de ambiente (sem logs)
if (!supabaseUrl || !supabaseAnonKey) {
  // Variáveis não configuradas - o erro será tratado no App.js
}

// Configuração do storage baseado na plataforma
// Desabilitar autoRefreshToken para evitar erros de refresh token inválido
// A sessão será gerenciada manualmente
const authConfig = {
  autoRefreshToken: false,
  persistSession: true,
  detectSessionInUrl: Platform.OS === 'web',
};

// Adicionar storage apenas para plataformas nativas
if (Platform.OS !== 'web' && AsyncStorage) {
  authConfig.storage = AsyncStorage;
}

// Inicialização do cliente Supabase
// Usa valores vazios se não estiverem configurados para evitar erros
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: authConfig,
  }
);