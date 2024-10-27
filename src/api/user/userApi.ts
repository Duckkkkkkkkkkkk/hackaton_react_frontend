import axios from "axios";

export interface Project {
  id?: number;
  title?: string; 
  customer?: string;
  contact_person?: string;
  contact_data?: string;
  description?: string;
  status?: string;
  technical_task?: string;
  start_date?: string;
  end_date?: string;
  comment?: string;
  users?: User[] | number[];
}

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  direction?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  login?: string;
  role?: string;
  status?: string;
  position?: string;
  about?: string;
  portfolio?: string;
  note?: string;
  title?: string;
  tasks?: Task[];
  projects?: Project[];
}

export interface Task {
  id?: number;
  title?: string;
}
const API_URL = "https://persiky.ru";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchUserByStatus = async (
  status: string,
  stage: string,
  searchText: string,
  sortField?: string,
  sortOrder: "asc" | "desc" = "asc"
): Promise<User[]> => {
  try {
    const params = new URLSearchParams();
    params.append("status", status);

    if (stage) params.append("stage", stage);
    if (searchText) params.append("search", searchText);
    if (sortField) {
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder);
    }

    const response = await api.get<User[]>("/user/status", { params });
    console.log(`Ответ от сервера (стажеры, статус ${status}):`, response.data);

    return response.data;
  } catch (error) {
    console.error(
      `Ошибка при получении стажеров со статусом ${status}:`,
      error
    );
    throw error;
  }
};
export const fetchProject = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/project/list");
  const users = response.data;
  console.log("Все проекты :", users);
  return users;
};

export const createUser = async (userData: User): Promise<User> => {
  try {
    const cleanedUserData: Partial<User> = { ...userData };
    (Object.keys(cleanedUserData) as (keyof User)[]).forEach((key) => {
      if (cleanedUserData[key] === undefined || cleanedUserData[key] === "") {
        delete cleanedUserData[key];
      }
    });
    delete cleanedUserData.projects;

    const response = await api.post("/user", cleanedUserData);
    const createdUser = response.data;

    return createdUser;
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    throw error;
  }
};

export const updateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  try {
    const dataToUpdate: Partial<User> = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
      direction: userData.direction,
      phone: userData.phone,
      telegram: userData.telegram,
      email: userData.email,
      login: userData.login,
      role: userData.role,
      position: userData.position,
      about: userData.about,
      portfolio: userData.portfolio,
      note: userData.note,
      title: userData.title,
    };

    console.log(`Обновление пользователя с ID ${id}`);
    console.log("Данные для обновления:", dataToUpdate);
    const response = await api.patch(`/user/${id}`, dataToUpdate);

    console.log(
      "Ответ от сервера (редактирование пользователя):",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw new Error("Ошибка при обновлении пользователя");
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    console.log(`Попытка удалить пользователя с id ${id}`);
    const response = await api.delete(`/user/${id}`);
    console.log(`Ответ сервера при удалении пользователя:`, response);
    console.log(`Стажер с id ${id} успешно удален`);
  } catch (error) {
    console.error("Ошибка при удалении юзера:", error);
    throw error;
  }
};

export interface User2 {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await api.get<User2[]>("/user/list");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    throw error;
  }
}