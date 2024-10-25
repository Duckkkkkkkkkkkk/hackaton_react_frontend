import axios from "axios";

const API_URL = "https://cardfile.geryon.space/api";

export interface Projects {
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
  users?: User[];
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
  study_group?: string;
  plans?: string;
  position?: string;
  about?: string;
  portfolio?: string;
  note?: string;
  inn?: string;
  snils?: string;
  birthday?: string;
  passport_data?: string;
  registration_address?: string;
  living_address?: string;
  requisites?: string;
  customer?: string;
  npd_reference?: string;
  title?: string;
  // competencies?: Competency[];
  // internships?: Internship[];
  // tasks?: Task[];
  projects?: Projects[];
}

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

export async function fetchProjects(
  stage: string,
  search: string,
  orderDesc?: string,
  fields?: string
): Promise<Projects[]> {
  const token = localStorage.getItem("access_token");
  const params: any = {
    stage,
    search,
    order_desc: orderDesc,
    fields,
  };
  console.log("Запрос на получение проектов с параметрами:", params);
  const response = await axios.get<Projects[]>(`${API_URL}/project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  console.log("Ответ от сервера (проекты):", response.data);
  return response.data;
}

export const createProject = async (
  project: Projects
): Promise<Projects> => {
  try {
    console.log("Отправка данных проекта на сервер:", project);
    const response = await api.post("/project", project);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    throw error;
  }
};

export const updateProject = async (
  id: number,
  {
    title,
    customer,
    contact_person,
    contact_data,
    description,
    status,
    technical_task,
    start_date,
    end_date,
    comment,
  }: Partial<Projects>
) => {
  try {
    const dataToUpdate = {
      title,
      customer,
      contact_person,
      contact_data,
      description,
      status,
      technical_task,
      start_date,
      end_date,
      comment,
    };
    console.log(`Обновление проекта с ID ${id}`);
    console.log("Данные для обновления:", dataToUpdate);
    const response = await api.patch(`/project/${id}`, dataToUpdate);
    console.log("Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await api.delete(`/project/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении проекта:", error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/user/list");
  const users = response.data;

  console.log("Все пользователи:", users);

  return users;
};