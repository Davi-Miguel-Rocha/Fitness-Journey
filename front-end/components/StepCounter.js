import React, { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

const dailyGoal = 5000;

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      const permissionStatus = await Pedometer.getPermissionsAsync();

      if (permissionStatus.status !== 'granted') {
        const response = await Pedometer.requestPermissionsAsync();
        if (response.status !== 'granted') {
          setIsPedometerAvailable('not granted');
          return;
        }
      }

      setIsPedometerAvailable(String(isAvailable));
      if (isAvailable) {
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) { // ADDED: Check if subscription exists before removing it
        subscription.remove();
      }
    };
  }, []);

  const progress = currentStepCount / dailyGoal;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador de Passos</Text>
      <Text style={styles.stepCountText}>
        {currentStepCount}
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