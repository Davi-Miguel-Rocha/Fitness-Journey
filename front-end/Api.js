// front-end/Api.js

const API_BASE_URL = 'http://192.168.15.123:8080/api/usuarios';

export const cadastrarUsuario = async (nome) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    });

    if (!response.ok) {
      throw new Error('Erro no cadastro. Verifique os dados.');
    }
    return await response.json(); // Retorna os dados do usuário criado
  } catch (error) {
    console.error('Erro ao conectar com a API:', error);
    throw error;
  }
};