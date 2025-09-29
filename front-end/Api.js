// api.js

const API_URL = 'http://localhost:8080/usuarios'; // URL do seu controlador de usuário

/**
 * Envia o nome do usuário para o endpoint de cadastro como um parâmetro de URL.
 * @param {string} userName - O nome do usuário.
 */
export async function registerUser(userName) {
  try {
    // Adiciona o nome do usuário como um parâmetro de consulta na URL
    const response = await fetch(`${API_URL}?nome=${userName}`, {
      method: 'POST', // O método HTTP POST
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // Converte a resposta do servidor para JSON

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Erro no cadastro.' };
    }
  } catch (error) {
    return { success: false, error: 'Erro de conexão. Tente novamente.' };
  }
}

/**
 * Consulta um usuário pelo ID.
 * @param {number} userId - O ID do usuário.
 */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_URL}/${userId}`);
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Usuário não encontrado.' };
    }
  } catch (error) {
    return { success: false, error: 'Erro de conexão. Tente novamente.' };
  }
}