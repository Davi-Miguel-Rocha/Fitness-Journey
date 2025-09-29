import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import * as Progress from 'react-native-progress';

export default function SplashScreen({ onFinishLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress > 1) {
        progress = 1;
        clearInterval(interval);
        setTimeout(() => {
          onFinishLoading();
        }, 500);
      }
      setLoadingProgress(progress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.loadingText}>Carregando a Aventura...</Text>
      <Progress.Bar
        progress={loadingProgress}
        width={250}
        height={10}
        color={'#FFD700'}
        unfilledColor={'#4B0082'}
        borderColor={'#6A5ACD'}
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
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 20,
  },
  progressBar: {
    marginTop: 10,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  progressText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});