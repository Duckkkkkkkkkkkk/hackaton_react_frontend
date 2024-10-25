import React, { useState } from "react";
import "../Login/Login.css";
import { logIn } from "../../api/auth/LoginApi";

// import cowImage from "./../images/img/cow_shadow.png";
import open_eye_icon from "../../images/icons/icon_open_eye.svg";
import close_eye_icon from "../../images/icons/icon_close_eye.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

const LoginPage: React.FC = () => {
  useLogout();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    try {
      const response = await logIn(login, password);
      console.log("Авторизация успешна", response);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user_role", response.role);

      switch (response.role) {
        case "ADMIN":
          window.location.href = "/";
          break;
        case "CUSTOMER":
          window.location.href = "/"; // TODO поставила временное отображение страницы для роли тест
          break;
        case "SPECIALIST":
          window.location.href = "/"; // TODO поставила временное отображение страницы для роли тест
          break;
        default:
          window.location.href = "/"; // если роль неизвестна
      }
    } catch (error) {
      setError("Ошибка авторизации, проверьте логин и пароль");
    }
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Registration logic here
    console.log("Регистрация успешна:", { name, login, password, confirmPassword });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isRegister ? "Регистрация" : "Вход в аккаунт"}</h2>
        {error && <div className="login-error-message">{error}</div>}
        <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegister && (
            <div className="form-group">
              <input
                type="text"
                className="login-form-control"
                placeholder="ФИО"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              className="login-form-control"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
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
              required
            />
            {!isRegister && (
              <img
                src={passwordVisible ? close_eye_icon : open_eye_icon}
                alt="Toggle password visibility"
                className="toggle-pass-icon"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
          {isRegister && (
            <div className="form-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="login-form-control"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="forgot-password">
            <a href="#">
              {isRegister ? "" : "Забыли пароль?"}             
            </a>
          </div>
          <div className="login-btn">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </div>
          <div className="forgot-password">
            <a href="#" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Авторизация" : "Регистрация"}
            </a>
          </div>
        </form>
      </div>
      <div className="login-image">
        {/* здесь будет картинка наверное */}
      </div>
    </div>
  );
};

export default LoginPage;