import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    // Limpar erros anteriores
    setError('');

    // Validação básica
    if (!email || !password) {
      const errorMsg = 'Por favor, preencha todos os campos.';
      setError(errorMsg);
      Alert.alert('Campos Obrigatórios', errorMsg);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = 'Por favor, insira um email válido.\n\nExemplo: seuemail@exemplo.com';
      setError('Email inválido. Use o formato: usuario@exemplo.com');
      Alert.alert('Email Inválido', errorMsg);
      return;
    }

    setLoading(true);
    setError(''); // Limpar erro ao iniciar login

    try {
      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        const errorMsg = 'O Supabase não está configurado. Verifique as variáveis de ambiente.';
        setError(errorMsg);
        Alert.alert('Erro de Configuração', errorMsg);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        let errorMsg = 'Erro ao fazer login. Verifique suas credenciais.';
        
        // Tratamento simples de erros
        if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMsg = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (
          error.message?.toLowerCase().includes('email not confirmed') || 
          error.message?.toLowerCase().includes('email_not_confirmed')
        ) {
          errorMsg = 'Por favor, confirme seu email antes de fazer login.\n\nSe você já desabilitou a confirmação de email no Supabase, execute o script SQL "supabase-fix-email-verification.sql" para marcar seu email como verificado.';
        } else if (
          error.message?.includes('Invalid login credentials') || 
          error.code === 'invalid_credentials' ||
          error.status === 400
        ) {
          // Mensagem simples - sem verificação de email
          errorMsg = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (
          error.message?.toLowerCase().includes('user not found') || 
          error.message?.toLowerCase().includes('does not exist') ||
          error.code === 'user_not_found'
        ) {
          errorMsg = 'Usuário não cadastrado';
        }
        
        setError(errorMsg);
        Alert.alert('Erro no Login', errorMsg);
      } else {
        setError(''); // Limpar erro em caso de sucesso
        
        // Salvar data do primeiro login se não existir
        if (data?.user?.id) {
          try {
            const firstLoginDate = await AsyncStorage.getItem(`firstLoginDate_${data.user.id}`);
            if (!firstLoginDate) {
              // Se não houver data salva, salvar a data atual como primeiro login
              const today = new Date().toISOString();
              await AsyncStorage.setItem(`firstLoginDate_${data.user.id}`, today);
            }
          } catch (storageError) {
            // Erro ao salvar data - não bloqueia o login
          }
        }
        
        // Navegar para Menu após login bem-sucedido
        navigation.navigate('Menu');
      }
    } catch (error) {
      let errorMsg = `Ocorreu um erro inesperado: ${error.message || 'Erro desconhecido'}`;
      // Traduzir mensagens de erro comuns
      errorMsg = errorMsg.replace(/Email address\s*"?"?\s*is invalid/gi, 'Por favor, insira um email válido no formato: usuario@exemplo.com');
      setError(errorMsg);
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
        transition={200}
      />
      <Text style={styles.title}>Login</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ResetPasswordModal
        visible={resetPasswordMode}
        onClose={() => {
          setResetPasswordMode(false);
          setResetEmail('');
        }}
        email={email}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail (ex: usuario@exemplo.com)"
        placeholderTextColor="#888"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(''); // Limpar erro ao digitar
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(''); // Limpar erro ao digitar
          }}
          secureTextEntry={!showPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.eyeButtonText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.7}
      >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
      </TouchableOpacity>

      {/* Link para esqueci minha senha */}
      <TouchableOpacity 
        onPress={() => setResetPasswordMode(true)}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* Texto para a navegação de cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Não tem uma conta? Crie aqui.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Modal para resetar senha
function ResetPasswordModal({ visible, onClose, email: initialEmail }) {
  const [email, setEmail] = useState(initialEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'fitness-journey://reset-password',
      });

      if (resetError) {
        setError(resetError.message || 'Erro ao enviar email de recuperação.');
      } else {
        setSuccess(true);
        Alert.alert(
          'Email Enviado!',
          'Verifique sua caixa de entrada. Um link para redefinir sua senha foi enviado.',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Recuperar Senha</Text>
        
        {success ? (
          <>
            <Text style={styles.modalText}>
              Um email foi enviado para {email} com instruções para redefinir sua senha.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.modalText}>
              Digite seu email e enviaremos um link para redefinir sua senha.
            </Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#888"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 550,
    height: 330,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeButtonText: {
    fontSize: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
    color: '#2E7D32',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2E7D32',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#e0e0e0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});