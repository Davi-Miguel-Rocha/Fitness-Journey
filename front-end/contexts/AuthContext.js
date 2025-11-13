import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Verificar se o Supabase está configurado
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return;
    }
    
    // Não carregar sessão automaticamente - sempre começar na tela de login
    // A sessão só será carregada quando o usuário fizer login explicitamente
    setSession(null);
    setUser(null);
    setLoading(false);

    // Limpar qualquer sessão existente ao iniciar - sempre começar na tela de login
    // Isso garante que o usuário sempre veja a tela de login primeiro
    const clearSessionOnStart = async () => {
      try {
        // Limpar sessão para garantir que sempre comece na tela de login
        await supabase.auth.signOut();
        // Garantir que o estado está limpo
        setSession(null);
        setUser(null);
      } catch (error) {
        // Ignorar erros ao limpar sessão, mas garantir que o estado está limpo
        setSession(null);
        setUser(null);
      }
    };

    // Limpar sessão ao iniciar (executar imediatamente)
    clearSessionOnStart();

    // Ouvir mudanças na autenticação
    // Usar um flag para ignorar o evento inicial (INITIAL_SESSION)
    let isInitialLoad = true;
    let subscription;
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Ignorar evento inicial - sempre começar sem sessão
        if (isInitialLoad && event === 'INITIAL_SESSION') {
          isInitialLoad = false;
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        isInitialLoad = false;
        
        // Tratar erros de refresh token
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Se o refresh falhou, limpar sessão
          await supabase.auth.signOut();
        }
        
        // Só atualizar estado se não for evento inicial
        if (event !== 'INITIAL_SESSION') {
          setSession(session);
          setUser(session?.user ?? null);
        } else {
          // Sempre começar sem sessão
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      });
      subscription = sub;
    } catch (error) {
      // Se houver erro ao configurar listener, limpar sessão inválida
      if (error.message?.includes('Invalid Refresh Token') || error.message?.includes('Refresh Token Not Found')) {
        supabase.auth.signOut();
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

