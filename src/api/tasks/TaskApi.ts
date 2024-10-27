import axios from "axios";

const API_URL = "https://persiky.ru";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  project_title?: string;
  hours?: number;
  comment?: string | null;
  executor_id?: number;
  reviewer_id?: number | null;
  status: string;
  project_id?: number;
  is_done: boolean;
  project: {
    title: string;
  };
}

export interface Project2 {
  id: number;
  title: string;
  customer?: string;
  contact_person?: string;
  contact_data?: string;
  description?: string;
  status?: string;
  technical_task?: string;
  start_date?: string;
  end_date?: string;
}

export interface ProjectTitle {
  id: number;
  title: string;
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
  fields?: string,
  orderDesc?: string,
  search?: string
): Promise<Project2[]> {
  const token = localStorage.getItem("access_token");
  const params: any = {
    stage,
    fields,
    order_desc: orderDesc,
    search,
  };

  console.log("Запрос на получение проектов с параметрами:", params);

  const response = await axios.get<Project2[]>(`${API_URL}/project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  console.log("Ответ от сервера (проекты):", response.data);

  return response.data;
}

export async function fetchProjectTitles(): Promise<string[]> {
  const token = localStorage.getItem("access_token");

  const response = await axios.get<Project2[]>(`${API_URL}/project/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.map((project) => project.title);
}

export const fetchProjectTitle = async (): Promise<Project2[]> => {
  const response = await axios.get<ProjectTitle[]>(`${API_URL}/project/list`);
  return response.data;
};

export const fetchProjectTitleByName = async (
  title: string
): Promise<number | null> => {
  try {
    const response = await api.get<Project2[]>(`${API_URL}/project/list`, {
      params: { search: title },
    });

    const project = response.data.find((project) => project.title === title);

    return project ? project.id : null;
  } catch (error) {
    console.error("Ошибка при получении проекта по названию:", error);
    return null;
  }
};

export const getProjectIdByTitles = async (
  title: string
): Promise<number | null> => {
  const projects = await fetchProjectTitle();
  const project = projects.find((project) => project.title === title);
  return project ? project.id : null;
};

export async function fetchTasks(
  project_id?: number,
  executor_id?: number,
  status?: string,
  fields?: string,
  orderDesc?: string,
  search?: string
): Promise<Task[]> {
  const params: any = {};

  if (project_id) params.project_id = project_id;
  if (executor_id) params.executor_id = executor_id;
  if (status) params.status = status;
  if (fields) params.fields = fields;
  if (orderDesc) params.order_desc = orderDesc;
  if (search) params.search = search;

  console.log("Запрос на получение задач с параметрами:", params);

  try {
    const response = await api.get<Task[]>("/task", { params });
    console.log("Ответ от сервера (задачи):", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    throw error;
  }
}

export async function fetchTasksByProjectId(
  projectId: string,
  fields?: string,
  orderDesc?: string,
  search?: string
): Promise<Task[]> {
  const params: any = {};

  if (fields) params.fields = fields;
  if (orderDesc) params.order_desc = orderDesc;
  if (search) params.search = search;

  console.log(
    `Запрос на получение задач для проекта с ID ${projectId} с параметрами:`,
    params
  );

  try {
    const response = await api.get<Task[]>(`/task/by-project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      params,
    });

    console.log("Ответ от сервера (задачи):", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении задач по проекту:", error);
    throw error;
  }
}

const getProjectIdByTitle = async (title: string): Promise<number | null> => {
  try {
    const projects = await fetchProjects("", "id,title", undefined, title);
    const project = projects.find((p) => p.title === title);

    if (project && project.id !== undefined) {
      return project.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении ID проекта по названию:", error);
    throw error;
  }
};

export const createTask = async (task: Task, userId: number): Promise<Task> => {
  try {
    if (task.project?.title) {
      const projectId = await fetchProjectTitleByName(task.project.title);
      if (projectId !== null) {
        task.project_id = projectId;
      } else {
        throw new Error("Проект не найден");
      }
    }

    task.executor_id = userId;
    task.reviewer_id = null;

    if (!task.status) {
      task.status = "NOTSTARTED";
    }

    const response = await api.post("/task", {
      title: task.title,
      start_date: task.start_date,
      end_date: task.end_date,
      project_id: task.project_id,
      reviewer_id: task.reviewer_id,
      executor_id: task.executor_id,
      status: task.status,
      hours: task.hours,
      comment: task.comment,
    });

    console.log("Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
    throw error;
  }
};

export const updateTask = async (
  id: number,
  userId: number,
  updateData: Partial<Task>
) => {
  try {
    console.log(`Обновление задачи с ID ${id}`);
    console.log("Данные для обновления:", updateData);

    if (updateData.project_title) {
      const projectId = await fetchProjectTitleByName(
        updateData.project_title as string
      );
      if (projectId !== null) {
        updateData.project_id = projectId;
      } else {
        throw new Error("Проект не найден");
      }
      delete updateData.project_title;
    }

    if (!updateData.status) {
      updateData.status = "NOTSTARTED";
    }
    updateData.executor_id = userId;

    if (updateData.reviewer_id === undefined) {
      updateData.reviewer_id = null;
    }

    const response = await api.patch(`/task/${id}`, {
      title: updateData.title,
      start_date: updateData.start_date,
      end_date: updateData.end_date,
      project_id: updateData.project_id,
      reviewer_id: updateData.reviewer_id,
      executor_id: updateData.executor_id,
      status: updateData.status,
      hours: updateData.hours,
      description: updateData.comment,
    });

    console.log("Ответ от сервера после обновления:", response.data);

    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/task/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    throw error;
  }
};
