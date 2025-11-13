import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const STEPS_PER_KM = 1500; // 1km = 1500 passos

export default function SetGoalScreen({ navigation }) {
  const { user } = useAuth();
  const [inputType, setInputType] = useState('steps'); // 'steps' ou 'km'
  const [inputValue, setInputValue] = useState('');
  const [calculatedValue, setCalculatedValue] = useState(null);

  const handleInputChange = (value) => {
    setInputValue(value);
    
    if (value && !isNaN(value) && parseFloat(value) > 0) {
      const numValue = parseFloat(value);
      if (inputType === 'km') {
        // Converter km para passos
        const steps = Math.round(numValue * STEPS_PER_KM);
        setCalculatedValue({ type: 'steps', value: steps });
      } else {
        // Converter passos para km
        const km = (numValue / STEPS_PER_KM).toFixed(2);
        setCalculatedValue({ type: 'km', value: parseFloat(km) });
      }
    } else {
      setCalculatedValue(null);
    }
  };

  const handleStart = async () => {
    if (!inputValue || isNaN(inputValue) || parseFloat(inputValue) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const numValue = parseFloat(inputValue);
    let goalInSteps;

    if (inputType === 'km') {
      goalInSteps = Math.round(numValue * STEPS_PER_KM);
    } else {
      goalInSteps = Math.round(numValue);
    }

    try {
      // Salvar meta no AsyncStorage
      const goalData = {
        steps: goalInSteps,
        km: (goalInSteps / STEPS_PER_KM).toFixed(2),
        date: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(`dailyGoal_${user?.id}`, JSON.stringify(goalData));
      
      // Navegar para a tela do contador de passos
      navigation.navigate('StepCounter', { goal: goalInSteps });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a meta. Tente novamente.');
    }
  };

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
        <Text style={styles.title}>Definir Meta do Dia</Text>
        <Text style={styles.subtitle}>
          Escolha quantos passos ou quilômetros você quer caminhar hoje
        </Text>

        {/* Seleção de Tipo */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, inputType === 'steps' && styles.typeButtonActive]}
            onPress={() => {
              setInputType('steps');
              setInputValue('');
              setCalculatedValue(null);
            }}
          >
            <Text style={[styles.typeButtonText, inputType === 'steps' && styles.typeButtonTextActive]}>
              Passos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, inputType === 'km' && styles.typeButtonActive]}
            onPress={() => {
              setInputType('km');
              setInputValue('');
              setCalculatedValue(null);
            }}
          >
            <Text style={[styles.typeButtonText, inputType === 'km' && styles.typeButtonTextActive]}>
              Quilômetros
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={inputType === 'km' ? 'Ex: 5' : 'Ex: 7500'}
            placeholderTextColor="#888"
            value={inputValue}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>
            {inputType === 'km' ? 'km' : 'passos'}
          </Text>
        </View>

        {/* Valor Calculado */}
        {calculatedValue && (
          <View style={styles.calculatedContainer}>
            <Text style={styles.calculatedLabel}>
              Equivale a aproximadamente:
            </Text>
            <Text style={styles.calculatedValue}>
              {calculatedValue.value.toLocaleString()} {calculatedValue.type === 'km' ? 'km' : 'passos'}
            </Text>
            <Text style={styles.calculatedNote}>
              (1 km = {STEPS_PER_KM.toLocaleString()} passos)
            </Text>
          </View>
        )}

        {/* Botão Começar */}
        <TouchableOpacity
          style={[styles.startButton, !inputValue && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={!inputValue}
        >
          <Text style={[styles.startButtonText, !inputValue && styles.startButtonTextDisabled]}>
            Começar
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 2,
    borderColor: '#4CAF50',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  calculatedContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  calculatedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calculatedValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  calculatedNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  startButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  startButtonTextDisabled: {
    color: '#000',
  },
});

