import React, { useState } from 'react';
import SignUpScreen from './SignUpScreen'; // Ou StepCounter, dependendo de qual tela você quer como principal
import SplashScreen from './SplashScreen'; // Importa a nova SplashScreen AJUSTAR REFERÊNCIA (ENDEREÇO)

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Função chamada pela SplashScreen quando o carregamento termina
  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    // Se ainda estiver carregando, mostra a SplashScreen
    return <SplashScreen onFinishLoading={handleFinishLoading} />;
  }

  // Se o carregamento terminou, mostra a tela principal (neste caso, SignUpScreen)
  return <SignUpScreen />; 
}
});
