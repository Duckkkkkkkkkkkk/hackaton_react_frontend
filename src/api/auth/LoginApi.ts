import axios from "axios";
import { LoginResponse } from "./interfaces/dto.auth";

const API_URL = "https://cardfile.geryon.space/api";

export const logIn = async (
  login: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      login,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка авторизации");
  }
};
