import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Splash';
import LoginScreen from './Login';
import SignUpScreen from './Cadastro.js';
import PedometerScreen from '../components/Pedometer.js';

// Cria o navegador de pilha para gerenciar as telas
const Stack = createNativeStackNavigator();

// Define a pilha principal de telas do seu aplicativo
function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Tela de Login, configurada para ser a tela inicial */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      {/* Tela de Cadastro */}
      <Stack.Screen name="Cadastro" component={SignUpScreen} options={{ title: 'Criar Conta' }} />
      <Stack.Screen name="Pedometer" component={PedometerScreen} options={{ title: 'Pedometer' }} />
    </Stack.Navigator>
  );
}

// O componente principal da aplicação
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Função chamada pela SplashScreen quando o carregamento termina
  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  // Se o aplicativo ainda está carregando, mostra a SplashScreen
  if (isLoading) {
    return <SplashScreen onFinishLoading={handleFinishLoading} />;
  }

  // Se o carregamento terminou, exibe o navegador principal
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}