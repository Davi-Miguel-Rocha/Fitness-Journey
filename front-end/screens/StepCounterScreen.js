import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import StepCounter from '../components/StepCounter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

export default function StepCounterScreen({ route, navigation }) {
  const { user } = useAuth();
  const [goal, setGoal] = useState(route.params?.goal || 5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      // Tentar carregar meta salva
      const goalData = await AsyncStorage.getItem(`dailyGoal_${user?.id}`);
      if (goalData) {
        const parsed = JSON.parse(goalData);
        setGoal(parsed.steps);
      } else if (route.params?.goal) {
        // Usar meta passada como parâmetro
        setGoal(route.params.goal);
      }
    } catch (error) {
      // Erro ao carregar meta - usar valor padrão
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
          transition={200}
        />
        <StepCounter dailyGoal={goal} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 550,
    height: 330,
    marginTop: 10,
    marginBottom: 20,
  },
});

