import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const useLogout = () => {
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64));
      const payload = JSON.parse(jsonPayload);
      return payload.exp;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && token.length > 0) {
      const exp = parseJwt(token);
      if (exp && exp * 1000 < Date.now()) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        return navigate("/");
      }
    }
  }, []);
};
