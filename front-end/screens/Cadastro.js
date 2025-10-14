// screens/Cadastro.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Cadastro = () => {
  const [nome, setNome] = useState('');

  const handleCadastro = async () => {
    // Verifique se o campo nome não está vazio
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome.');
      return;
    }

    try {
      // Ajuste na URL e no corpo da requisição para enviar JSON
      const response = await fetch(`http://192.168.15.123:8080/usuarios?nome=${encodeURIComponent(nome)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ nome }), // <--- Aqui o 'nome' é enviado como JSON
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        setNome(''); // Limpa o campo após o sucesso
      } else {
        const errorData = await response.json();
        Alert.alert('Erro no Cadastro', errorData.message || 'Ocorreu um erro no servidor.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Cadastro;