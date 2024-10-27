import React, { useState, useEffect } from "react";
import "../Login/Login.css";
import Snackbar, { SnackbarType } from "../../components/Snackbar/Snackbar"
import { logIn } from "../../api/auth/LoginApi";
import { register } from "../../api/auth/registerApi";

import open_eye_icon from "../../images/icons/icon_open_eye.svg";
import close_eye_icon from "../../images/icons/icon_close_eye.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import icon_webpraktik from "../../images/icons/icon_webpraktik.svg"

const LoginPage: React.FC = () => {
  useLogout();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType | null>(null);

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  if (token && role) {
    switch (role) {
      case "ADMIN":
        return <Navigate to={"/main-admin-panel"} />;
      case "SPECIALIST":
        return <Navigate to={"/project_view"} />;
      case "CUSTOMER":
        return <Navigate to={"/project_view"} />;
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await attemptLogin();
  };

  const attemptLogin = async () => {
    try {
      const response = await logIn(login, password);
      console.log("Авторизация успешна", response);

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user_role", response.role);
      setSnackbarType("successAdd");

      window.location.href = roleRedirect(response.role);
    } catch (error) {
      setSnackbarType("failureLogin");
    }
  };

  const roleRedirect = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/main-admin-panel";
      case "SPECIALIST":
      case "GUEST":
        return "/projects";
      default:
        return "/";
    }
  };

  // useEffect(() => {
  //   if (!isRegister) {
  //     attemptLogin();
  //   }
  // }, [isRegister]);

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await register({ login, firstName, lastName, middleName });
      console.log("Registration successful:", response);
      setIsRegister(false);
      setSnackbarType("successRegister");
    } catch (error: any) {
      const errorMessage = error.response?.data?.response?.message;
      if (errorMessage === "USER ALREADY EXISTS") {
        setSnackbarType("failureEmail");
      } else {
        setSnackbarType("errorSendingData");
      }
    }
  };
  

  return (
    <div className="login-container">
      <img className="wb_login" src={icon_webpraktik}></img>
      <div className="login-form">
        <h2>{isRegister ? "Регистрация" : "Вход в аккаунт"}</h2>
        {error && <div className="login-error-message">{error}</div>}
        <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegister ? (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="login-form-control"
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="login-form-control"
                  placeholder="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="login-form-control"
                  placeholder="Отчество"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  maxLength={25}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="login-form-control"
                  placeholder="Логин (Email)"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <input
                  type="text"
                  className="login-form-control"
                  placeholder="Логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>
              <div className="form-group password-group">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="login-form-control"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={20}
                  required
                />
                <img
                  src={passwordVisible ? close_eye_icon : open_eye_icon}
                  alt="Toggle password visibility"
                  className="toggle-pass-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </>
          )}
          <div className="forgot-password">
            {!isRegister && <a href="#">Забыли пароль?</a>}
          </div>
          <button className="login-btn" type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
          <div className="forgot-password">
            <a href="#" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Авторизация" : "Регистрация"}
            </a>
          </div>
        </form>
      </div>
      {snackbarType && (
        <Snackbar
          type={snackbarType}
          duration={3000}
          onClose={() => setSnackbarType(null)}
        />
      )}
      <div className="login-image">
        {/* Optional image placeholder */}
      </div>
    </div>
  );
};

export default LoginPage;
