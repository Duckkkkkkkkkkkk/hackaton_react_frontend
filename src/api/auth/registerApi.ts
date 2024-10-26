import axios from 'axios';

const API_URL = "https://persiky.ru";

export const register = async (userData: {
  login: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    throw error;
  }
};
