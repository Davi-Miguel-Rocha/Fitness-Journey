import React, { useState, useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View, Platform } from 'react-native';
import * as Progress from 'react-native-progress';

export default function StepCounter({ dailyGoal = 5000 }) {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [actualStepCount, setActualStepCount] = useState(0); // O valor real do pedômetro
  const [displayedStepCount, setDisplayedStepCount] = useState(0); // O valor que será exibido na tela
  const [errorMessage, setErrorMessage] = useState('');
  const stepInterval = useRef(null);

  useEffect(() => {
    // No web, o pedômetro não está disponível
    if (Platform.OS === 'web') {
      setIsPedometerAvailable('false');
      setErrorMessage('O contador de passos funciona apenas em dispositivos móveis (Android/iOS).');
      return;
    }

    let subscription;

    const subscribe = async () => {
      try {
        // Verificar se o pedômetro está disponível
        const isAvailable = await Pedometer.isAvailableAsync();
        
        if (!isAvailable) {
          setIsPedometerAvailable('false');
          setErrorMessage('Pedômetro não disponível neste dispositivo.');
          return;
        }

        // Solicitar permissões
        const permissionStatus = await Pedometer.getPermissionsAsync();
        
        if (permissionStatus.status !== 'granted') {
          const response = await Pedometer.requestPermissionsAsync();
          if (response.status !== 'granted') {
            setIsPedometerAvailable('not granted');
            setErrorMessage('Permissão para atividade física negada. Por favor, permita o acesso nas configurações do dispositivo.');
            return;
          }
        }

        // Se chegou aqui, está disponível e com permissão
        setIsPedometerAvailable('true');
        setErrorMessage('');

        // Iniciar monitoramento de passos
        subscription = Pedometer.watchStepCount(result => {
          if (result && result.steps !== undefined) {
            setActualStepCount(result.steps);
          }
        });
      } catch (error) {
        console.error('Erro ao configurar pedômetro:', error);
        setIsPedometerAvailable('error');
        setErrorMessage('Erro ao acessar o pedômetro. Verifique as permissões do app.');
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (stepInterval.current) {
        clearInterval(stepInterval.current);
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
          if (diff <= 0) {
            return actualStepCount; // Sincroniza imediatamente se já passou
          }
          if (diff > 10) { // Incrementa mais rápido para grandes saltos
            return Math.min(prevCount + Math.floor(diff / 5), actualStepCount);
          } else {
            return Math.min(prevCount + 1, actualStepCount);
          }
        });
      }, 50);
    } else if (displayedStepCount > actualStepCount) {
      // Se o valor exibido for maior que o real, sincroniza imediatamente
      setDisplayedStepCount(actualStepCount);
    }

    return () => {
      if (stepInterval.current) {
        clearInterval(stepInterval.current);
      }
    };
  }, [actualStepCount]);

  const progress = Math.min(displayedStepCount / dailyGoal, 1); // Limita o progresso a 1 (100%)

  // Se não está disponível ou há erro, mostrar mensagem
  if (isPedometerAvailable !== 'true') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contador de Passos</Text>
        <Text style={styles.stepCountText}>0</Text>
        <Text style={styles.goalText}>Meta: {dailyGoal} passos</Text>
        <Progress.Bar
          progress={0}
          width={200}
          color={'#4CAF50'}
          unfilledColor={'#E8F5E9'}
          style={styles.progressBar}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={styles.infoText}>
            {isPedometerAvailable === 'checking' 
              ? 'Verificando disponibilidade...' 
              : 'Pedômetro não disponível'}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador de Passos</Text>
      <Text style={styles.stepCountText}>
        {displayedStepCount.toLocaleString()}
      </Text>
      <Text style={styles.goalText}>Meta: {dailyGoal.toLocaleString()} passos</Text>

      <Progress.Bar
        progress={progress}
        width={200}
        color={'#4CAF50'}
        unfilledColor={'#E8F5E9'}
        style={styles.progressBar}
      />

      <Text style={styles.progressText}>
        {Math.round(progress * 100)}% da meta diária
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  stepCountText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginVertical: 15,
  },
  goalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  progressBar: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 13,
    color: '#dc3545',
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});