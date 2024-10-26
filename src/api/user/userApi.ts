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

export interface Competency {
  id?: number;
  text?: string;
  users?: User[];
}
export interface Competencies {
  id?: number;
  text?: string;
}

export interface Task {
  id?: number;
  title?: string;
}
const API_URL = "https://cardfile.geryon.space/api";

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
export const fetchCompetency = async (): Promise<Competencies[]> => {
  const response = await api.get<Competencies[]>("/competency/titles");
  const users = response.data;
  console.log("Все компетенции :", users);
  return users;
};
export const fetchInterns = async (
  stage: string,
  searchText: string,
  sortField?: string,
  sortOrder: "asc" | "desc" = "asc"
): Promise<User[]> => {
  return fetchUserByStatus(
    "INTERNSHIP",
    stage,
    searchText,
    sortField,
    sortOrder
  );
};

export const fetchPractice = async (
  stage: string,
  searchText: string,
  sortField?: string,
  sortOrder: "asc" | "desc" = "asc"
): Promise<User[]> => {
  return fetchUserByStatus("PRACTICE", stage, searchText, sortField, sortOrder);
};

export const fetchSpecialist = async (
  stage: string,
  searchText: string,
  sortField?: string,
  sortOrder?: "asc" | "desc"
): Promise<User[]> => {
  return fetchUserByStatus(
    "SPECIALIST",
    stage,
    searchText,
    sortField,
    sortOrder
  );
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

export const createNewCompetency = async (
  userId: number,
  competencyText: string
): Promise<void> => {
  try {
    console.log("Создание новой компетенции:", competencyText);
    const competencyCreateData = {
      text: competencyText,
      users: [userId],
    };
    await api.post(`/competency`, competencyCreateData);
  } catch (error) {
    console.error("Ошибка при создании новой компетенции:", error);
    throw error;
  }
};

export const createCompetencies = async (
  userId: number,
  competencies: Competency[]
): Promise<void> => {
  try {
    if (competencies && competencies.length > 0) {
      const competencyCreatePromises = competencies.map(async (competency) => {
        if (competency.id) {
          console.log(
            `Связывание существующей компетенции (ID: ${competency.id}) с пользователем (ID: ${userId})`
          );
          await api.patch(`/competency/${competency.id}`, {
            users: [userId]
          });
        } else {
          console.log("Создание новой компетенции:", competency.text);
          const competencyCreateData = {
            text: competency.text,
            users: [userId],
          };
          await api.post(`/competency`, competencyCreateData);
        }
      });

      await Promise.all(competencyCreatePromises);
    }
  } catch (error) {
    console.error("Ошибка при создании компетенций:", error);
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

// export async function fetchProjectTitles(): Promise<string[]> {
//   const token = localStorage.getItem("access_token");

//   const response = await axios.get<Project[]>(`${API_URL}/project/list`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data.map((project) => project.title);
// }