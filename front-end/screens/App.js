import React, { useState, useEffect, useRef, Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SingUp';
import MenuScreen from './MenuScreen';
import SetGoalScreen from './SetGoalScreen';
import StepCounterScreen from './StepCounterScreen';

// Error Boundary para capturar erros de renderização
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Erro capturado pelo ErrorBoundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao Renderizar</Text>
          <Text style={styles.errorDetails}>
            {this.state.error?.message || 'Erro desconhecido'}
            {'\n\n'}
            Tente recarregar o app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { user } = useAuth();
  const navigationRef = useRef(null);

  // Sempre navegar para Login após o splash
  useEffect(() => {
    if (!splashFinished) return;
    
    // Aguardar um pouco para garantir que o NavigationContainer está pronto
    const timer = setTimeout(() => {
      if (!navigationRef.current) return;
      // Sempre navegar para Login, independente do estado de autenticação
      navigationRef.current?.navigate('Login');
    }, 100);

    return () => clearTimeout(timer);
  }, [splashFinished]);

  // Não navegar automaticamente para Menu - apenas quando o usuário fizer login explicitamente
  // A navegação será feita diretamente nas telas de Login/SignUp após sucesso

  // Sempre mostrar SplashScreen primeiro
  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  // Após o splash, usar um único NavigationContainer
  // Todas as telas são registradas, mas a rota inicial depende do estado de autenticação
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ 
            title: 'Criar Conta', 
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ 
            title: 'Menu',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="SetGoal" 
          component={SetGoalScreen} 
          options={{ 
            title: 'Definir Meta',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="StepCounter" 
          component={StepCounterScreen} 
          options={{ 
            title: 'Contador de Passos',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Configuração Necessária</Text>
        <Text style={styles.errorDetails}>
          Por favor, configure as variáveis de ambiente do Supabase.{'\n\n'}
          Crie um arquivo .env na pasta front-end com:{'\n'}
          EXPO_PUBLIC_SUPABASE_URL=sua_url{'\n'}
          EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave{'\n\n'}
          Depois reinicie o servidor Expo.
        </Text>
      </View>
    );
  }

  // Componente wrapper para capturar erros
  const AppContent = () => {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ErrorBoundary>
    );
  };

  return <AppContent />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});