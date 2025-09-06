const API_URL = 'http://localhost:8080/usuarios'; // URL do seu controlador de usuário

/**
 * Envia dados de cadastro de um novo usuário para a API.
 * @param {object} userData - Um objeto contendo os dados do usuário.
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Erro no cadastro.' };
    }
  } catch (error) {
    return { success: false, error: 'Erro de conexão. Tente novamente.' };
  }
}