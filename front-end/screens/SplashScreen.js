//INSTALAR BIBLIOTECAS
//AJUSTAR ENDEREÇOS DA LOGO (O ARQUIVO ESTÁ FORA DA PASTA)

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import * as Progress from 'react-native-progress';


export default function SplashScreen({ onFinishLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial da animação de opacidade

  useEffect(() => {
    // Animação de fade-in para a tela de carregamento
    Animated.timing(fadeAnim, {
      toValue: 1, // Anima para opacidade total
      duration: 1000, // Duração de 1 segundo
      useNativeDriver: true,
    }).start();

    // Simula o carregamento do aplicativo
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05; // Aumenta o progresso em 5% a cada 100ms
      if (progress > 1) {
        progress = 1;
        clearInterval(interval);
        setTimeout(() => {
          onFinishLoading(); // Chama a função quando o carregamento termina
        }, 500); // Pequeno atraso antes de ir para a próxima tela
      }
      setLoadingProgress(progress);
    }, 100); // Atualiza a cada 100 milissegundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image source={appLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.loadingText}>Carregando a Aventura...</Text>
      <Progress.Bar
        progress={loadingProgress}
        width={250} // Largura da barra de progresso
        height={10}
        color={'#FFD700'} // Cor dourada
        unfilledColor={'#4B0082'} // Cor roxa
        borderColor={'#6A5ACD'} // Borda roxa mais clara
        borderRadius={5}
        style={styles.progressBar}
      />
      <Text style={styles.progressText}>{Math.floor(loadingProgress * 100)}%</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', // Fundo escuro para realçar a logo
  },
  logo: {
    width: 300, // Largura máxima da logo
    height: 300, // Altura máxima da logo
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 20,
    color: '#FFD700', // Texto dourado
    marginBottom: 20,
  },
  progressBar: {
    marginTop: 10,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Deixa a barra um pouco maior
  },
  progressText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});
