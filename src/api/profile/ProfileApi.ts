import axios from "axios";

import {
  UserProfile,
  UserProfileUpdate,
  OrganizationUpdate,
} from "./interfaces/dto.profile";

const API_URL = "https://cardfile.geryon.space/api";

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get<UserProfile>(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных профиля", error);
    return null;
  }
};

export const updateUserProfile = async (
  profile: Partial<UserProfileUpdate>
): Promise<UserProfile | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Отправляемые данные", profile);

    const response = await axios.patch<UserProfile>(
      `${API_URL}/user`,
      profile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Данные запроса", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении данных профиля", error);
    return null;
  }
};

export const updateOrganization = async (
  organizationId: number,
  data: Partial<OrganizationUpdate>
): Promise<OrganizationUpdate | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Отправляемые данные для обновления организации", data);

    const response = await axios.patch<OrganizationUpdate>(
      `${API_URL}/organization/${organizationId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Данные запроса организации", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении данных организации", error);
    return null;
  }
};

export const getCompetencies = async (): Promise<{ id: number, text: string }[] | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get<{ id: number, text: string }[]>(`${API_URL}/competency/titles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка компетенций", error);
    return null;
  }
};