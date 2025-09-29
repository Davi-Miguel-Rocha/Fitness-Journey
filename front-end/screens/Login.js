import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

    const handleLogin = () => {
    // Aqui você pode adicionar uma validação simples para simular o login
    // Por exemplo, checar se os campos não estão vazios
    if (email && senha) {
      // Se a validação for bem-sucedida, navega para a tela do contador
      navigation.navigate('Pedometer'); // <-- Nome da sua tela de destino
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text>Ainda não tem um login?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.link}> Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  form: {},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  signupRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 16 
  },
  link: { 
    color: '#2563eb',
    fontWeight: '600' },
});
