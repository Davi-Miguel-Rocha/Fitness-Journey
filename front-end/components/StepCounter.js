import React, { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      // 1. Pede e verifica a permissão
      const isAvailable = await Pedometer.isAvailableAsync();
      const permissionStatus = await Pedometer.getPermissionsAsync();

      if (permissionStatus.status !== 'granted') {
        const response = await Pedometer.requestPermissionsAsync();
        if (response.status !== 'granted') {
          setIsPedometerAvailable('not granted');
          return;
        }
      }

      // Se a permissão for concedida, inicia o contador
      setIsPedometerAvailable(String(isAvailable));
      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contador de Passos</Text>
      <Text style={styles.text}>
        {isPedometerAvailable === 'checking' ? 'Carregando...' : currentStepCount}
      </Text>
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
    backgroundColor: '#ffffff'
  },
  text: {
    fontSize: 24,
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  }
});