import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // Não limpar erro imediatamente - será limpo apenas em caso de sucesso ou quando necessário

    // Validação básica
    if (!firstName || !lastName || !age || !email || !password) {
      const errorMsg = 'Por favor, preencha todos os campos.';
      setError(errorMsg);
      Alert.alert('Campos Obrigatórios', errorMsg);
      return;
    }

    // Validação simples de email - apenas verificar se tem @ e .
    if (!email.includes('@') || !email.includes('.')) {
      const errorMsg = 'Por favor, insira um email válido com @ e .';
      setError(errorMsg);
      Alert.alert('Email Inválido', errorMsg);
      return;
    }

    // Validação de senha (mínimo 6 caracteres)
    if (password.length < 6) {
      const errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      setError(errorMsg);
      Alert.alert('Senha Inválida', errorMsg);
      return;
    }

    // Validação de idade
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      const errorMsg = 'Por favor, insira uma idade válida (entre 1 e 120 anos).';
      setError(errorMsg);
      Alert.alert('Idade Inválida', errorMsg);
      return;
    }

    setLoading(true);
    // Não limpar erro imediatamente - será limpo apenas em caso de sucesso

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

      // 1. Criar o usuário no Supabase Auth (sem verificação de email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: undefined,
          // Desabilitar verificação de email - o usuário será autenticado imediatamente
          data: {
            email_verified: true, // Marcar email como verificado
          }
        }
      });

      if (authError) {
        let errorMsg = 'Erro ao fazer cadastro.';
        
        // Tratamento específico para erros de rede
        if (authError.message?.includes('Failed to fetch') || authError.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMsg = 'Erro de conexão com o servidor.\n\nVerifique:\n1. Sua conexão com a internet\n2. Se a URL do Supabase está correta\n3. Se o servidor Supabase está acessível';
        } else if (
          authError.message?.includes('User already registered') || 
          authError.message?.includes('already registered') ||
          authError.message?.includes('already exists') ||
          authError.code === 'user_already_registered'
        ) {
          errorMsg = 'Este email já está cadastrado. Tente fazer login ou use "Esqueci minha senha" para recuperar sua conta.';
        } else if (authError.message?.includes('Password should be at least')) {
          errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (
          authError.message?.includes('Invalid email') || 
          authError.message?.includes('Email address') ||
          authError.message?.includes('is invalid')
        ) {
          errorMsg = 'Por favor, insira um email válido com @ e .';
        } else {
          errorMsg = authError.message || 'Erro ao fazer cadastro.';
        }
        
        setError(errorMsg);
        Alert.alert('Erro no Cadastro', errorMsg);
        setLoading(false);
        return;
      }

      // 2. Se o usuário foi criado, fazer login automático e atualizar perfil
      if (authData && authData.user) {
        // Verificar se o email está confirmado
        const emailConfirmed = authData.user.email_confirmed_at || authData.user.confirmed_at;
        
        // Se não houver sessão OU email não confirmado, tentar fazer login automaticamente
        if (!authData.session || !emailConfirmed) {
          // Aguardar um pouco para garantir que o usuário foi criado no banco
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });
          
          if (loginError) {
            // Verificar se é erro de email não confirmado
            if (loginError.message?.toLowerCase().includes('email not confirmed') || 
                loginError.message?.toLowerCase().includes('email_not_confirmed')) {
              setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
              Alert.alert(
                'Email não confirmado', 
                'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.\n\nSe você já desabilitou a confirmação de email no Supabase, execute o script SQL para marcar o email como verificado.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setFirstName('');
                      setLastName('');
                      setAge('');
                      setEmail('');
                      setPassword('');
                      navigation.navigate('Login');
                    }
                  }
                ]
              );
            } else {
              // Outro erro - apenas navegar para tela de login
              setError('');
              Alert.alert(
                'Sucesso!', 
                'Usuário cadastrado com sucesso. Por favor, faça login.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setFirstName('');
                      setLastName('');
                      setAge('');
                      setEmail('');
                      setPassword('');
                      navigation.navigate('Login');
                    }
                  }
                ]
              );
            }
            setLoading(false);
            return;
          }
          
          // Se login funcionou, atualizar authData com a sessão
          if (loginData.session) {
            authData.session = loginData.session;
          }
        }
        
        // Atualizar perfil com informações adicionais
        // Só tentar se houver sessão válida (usuário autenticado)
        const currentSession = authData.session || (await supabase.auth.getSession()).data.session;
        
        if (currentSession && authData.user) {
          try {
            // Tentar inserir o perfil primeiro
            // Não enviar created_at ou updated_at - serão gerenciados pelo banco
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                age: ageNum,
              });

            // Se houver erro de duplicata (perfil já existe), tentar atualizar
            if (insertError) {
              // Verificar se é erro de duplicata (código 23505) ou violação de constraint única
              if (insertError.code === '23505' || insertError.message?.includes('duplicate') || insertError.message?.includes('already exists')) {
                // Perfil já existe, tentar atualizar
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    age: ageNum,
                  })
                  .eq('id', authData.user.id);
                
                // Se ainda houver erro, não bloquear o cadastro
                // O perfil pode ser atualizado depois
              }
              // Se for outro tipo de erro, não bloquear o cadastro
            }
            
            // Aguardar um pouco para garantir que o perfil foi salvo no banco
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (profileError) {
            // Não bloqueia o cadastro se houver erro ao criar/atualizar o perfil
            // O usuário pode atualizar o perfil depois
          }
        }

        // Se chegou aqui, o usuário foi criado com sucesso
        // Salvar data do primeiro login/cadastro
        try {
          const firstLoginDate = await AsyncStorage.getItem(`firstLoginDate_${authData.user.id}`);
          if (!firstLoginDate) {
            // Se não houver data salva, salvar a data atual como primeiro login
            const today = new Date().toISOString();
            await AsyncStorage.setItem(`firstLoginDate_${authData.user.id}`, today);
          }
        } catch (storageError) {
          // Erro ao salvar data - não bloqueia o cadastro
        }
        
        // Verificar se há sessão válida para decidir para onde navegar
        const finalSession = authData.session || (await supabase.auth.getSession()).data.session;
        
        // Limpar campos e estados ANTES de mostrar o Alert
        setFirstName('');
        setLastName('');
        setAge('');
        setEmail('');
        setPassword('');
        setError('');
        
        // Sempre mostrar mensagem de sucesso ANTES de navegar
        // Não usar setLoading(false) aqui - será feito no onPress do Alert
        if (finalSession) {
          // Se houver sessão, mostrar alert e navegar para Menu
          Alert.alert(
            'Sucesso!', 
            'Usuário cadastrado com sucesso',
            [
              {
                text: 'OK',
                onPress: () => {
                  setLoading(false);
                  // Navegar para Menu (usuário já está autenticado)
                  navigation.navigate('Menu');
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          // Se não houver sessão, mostrar alert e navegar para Login
          Alert.alert(
            'Sucesso!', 
            'Usuário cadastrado com sucesso. Por favor, faça login.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setLoading(false);
                  // Navegar para tela de login
                  navigation.navigate('Login');
                }
              }
            ],
            { cancelable: false }
          );
        }
      } else {
        // Se não houver usuário criado, mostrar erro
        setError('Erro ao criar usuário. Tente novamente.');
        Alert.alert('Erro', 'Não foi possível criar o usuário. Tente novamente.');
        setLoading(false);
      }
    } catch (error) {
      let errorMsg = 'Ocorreu um erro inesperado. Tente novamente.';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMsg = 'Erro de conexão com o servidor.\n\nVerifique:\n1. Sua conexão com a internet\n2. Se a URL do Supabase está correta no arquivo .env\n3. Se o servidor Supabase está acessível';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      Alert.alert('Erro no Cadastro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView para ajustar o layout
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
          transition={200}
        />
        <Text style={styles.title}>Cadastro de Usuário</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setError('');
          }}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setError('');
          }}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Idade"
          placeholderTextColor="#888"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            setError('');
          }}
          keyboardType="numeric"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail (ex: usuario@exemplo.com)"
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha (mínimo 6 caracteres)"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
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
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para voltar ao login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login aqui.</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    flexGrow: 1, // Permite que o conteúdo se expanda para ocupar a tela
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
  buttonDisabled: {
    opacity: 0.6,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#2E7D32',
    textDecorationLine: 'underline',
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
});