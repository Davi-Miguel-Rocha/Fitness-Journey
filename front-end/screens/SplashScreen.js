import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Simular um tempo mínimo de carregamento (1.5 segundos)
    const timer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
        transition={200}
      />
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      <Text style={styles.subtitle}>Carregando aventura...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 600,
    height: 420,
    marginBottom: 30,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 10,
    fontWeight: '500',
  },
});
