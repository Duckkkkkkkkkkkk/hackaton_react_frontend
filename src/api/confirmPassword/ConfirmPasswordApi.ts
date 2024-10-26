import axios from "axios";

const API_URL = "https://cardfile.geryon.space/api";

export const confirmPassword = async (
  oldPassword: string
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}/user/confirm-password`,
      {
        oldPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Данные", response.data);

    return response.data === true;
  } catch (error) {
    console.error("Error confirming password:", error);
    return false;
  }
};

export const updatePassword = async (
  newPassword: string,
  newPasswordConfirm: string
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `${API_URL}/user/password`,
      { newPassword, newPasswordConfirm },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data === true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};
