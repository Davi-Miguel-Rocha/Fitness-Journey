import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  // === 1. ESTADOS PARA GUARDAR OS DADOS ===
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [idade, setIdade] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado para o carregamento.

  // === 2. FUNÇÃO PRINCIPAL DE CADASTRO ===
  // Primeiro busca o IP e depois faz o cadastro.
  const handleSignUp = async () => {
    // --- 2.1. Validação dos Dados ---
    if (!nome || !sobrenome || !idade || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Ativa o estado de carregamento.

    try {
      // --- 2.2. BUSCANDO O IP DO SERVIDOR AUTOMATICAMENTE ---
      // Requisição a um serviço gratuito (ipify)
      // para descobrir o IP público da máquina que está executando o servidor.
      // ⚠️ ATENÇÃO: Para isso funcionar, o back end deve estar
      // rodando e a porta 8080 deve estar aberta para conexões externas no firewall.
      //const ipResponse = await fetch('https://api.ipify.org?format=json');
      //const ipData = await ipResponse.json();
      //const serverIp = ipData.ip; // O IP é retornado aqui.

      // --- 2.3. Montando a URL da API com o IP encontrado ---
      // Usamos o IP que acabamos de descobrir para montar a URL completa da API.
      // O '8080' é a porta padrão do Spring Boot. Se for outra porta deve ser ajustado manualmente
      const API_URL = `http://192.168.15.123:8080/api/usuarios`;

      // --- 2.4. ENVIANDO OS DADOS PARA A API ---
      // Agora que temos o IP, podemos fazer a requisição para o back end.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          sobrenome: sobrenome,
          idade: parseInt(idade, 10),
          senha: senha,
        }),
      });

      // --- 2.5. Lidando com a Resposta da API ---
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        console.log('Dados recebidos:', data);

        // Limpa os campos após o sucesso
        setNome('');
        setSobrenome('');
        setIdade('');
        setSenha('');

        // Navegamos para a próxima tela
        navigation.navigate('Pedometer');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', `Falha no cadastro: ${errorData.message}`);
      }
    } catch (error) {
      // --- 2.6. Lida com Erros de Conexão ---
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o back end está rodando e a porta 8080 está acessível.');
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false); // Desativa o carregamento.
    }
  };

  // === 3. CÓDIGO DO FRONT END (o que aparece na tela) ===
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>Bem-vindo à jornada!</Text>

        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="#888" value={sobrenome} onChangeText={setSobrenome} />
        <TextInput style={styles.input} placeholder="Idade" placeholderTextColor="#888" value={idade} onChangeText={setIdade} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" value={senha} onChangeText={setSenha} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login.</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20, flexGrow: 1 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#333', textAlign: 'center' },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16, color: '#333' },
  button: { width: '100%', height: 50, backgroundColor: '#4B0082', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  linkText: { marginTop: 20, fontSize: 16, color: '#4B0082', textDecorationLine: 'underline' },
});