import React, { useState, useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

const dailyGoal = 5000; // Defina a sua meta diária de passos aqui

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [actualStepCount, setActualStepCount] = useState(0); // O valor real do pedômetro
  const [displayedStepCount, setDisplayedStepCount] = useState(0); // O valor que será exibido na tela
  const stepInterval = useRef(null);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setActualStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Efeito para animar o contador
  useEffect(() => {
    // Para evitar animação em ciclos, limpa o intervalo antigo se existir
    if (stepInterval.current) {
      clearInterval(stepInterval.current);
    }

    if (displayedStepCount < actualStepCount) {
      stepInterval.current = setInterval(() => {
        setDisplayedStepCount(prevCount => {
          const diff = actualStepCount - prevCount;
          if (diff > 10) { // Incrementa mais rápido para grandes saltos
            return prevCount + Math.floor(diff / 5);
          } else {
            return prevCount + 1;
          }
        });
      }, 50);
    }

    return () => {
      if (stepInterval.current) {
        clearInterval(stepInterval.current);
      }
    };
  }, [actualStepCount]);

  const progress = displayedStepCount / dailyGoal;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador de Passos</Text>
      <Text style={styles.stepCountText}>
        {displayedStepCount}
      </Text>
      <Text style={styles.goalText}>Meta: {dailyGoal} passos</Text>

      <Progress.Bar
        progress={progress}
        width={200}
        color={'#FFD700'}
        unfilledColor={'#4B0082'}
        style={styles.progressBar}
      />

      {isPedometerAvailable === 'not granted' && (
        <Text style={styles.errorText}>Permissão para atividade física negada.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepCountText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  progressBar: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});