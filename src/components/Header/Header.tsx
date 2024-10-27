import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import icon_webpraktik from "../../images/icons/icon_webpraktik.svg";
import icon_burger from "../../images/icons/icon_burger.svg";
import icon_projects from "../../images/icons/icon_projects.svg";
import icon_profile from "../../images/icons/icon_profile.svg";
import icon_exit from "../../images/icons/icon_exit.svg";
import { useLayout } from "../Context/LayoutContext";

const Header: React.FC = () => {
  const { showHeader } = useLayout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Проверка, находитесь ли вы на странице входа
  const isLoginPage = location.pathname === "/"; // Измените путь на ваш путь входа

  if (!showHeader || isLoginPage) {
    return null; // Скрыть Header на странице входа
  }

  const handleBurgerClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="header">
        <img className="icon_webpraktik" src={icon_webpraktik} alt="webpractice" />
        <img className="icon_burger" src={icon_burger} alt="burger" onClick={handleBurgerClick} />
      </header>

      {/* Модальное окно */}
      <div className={`modal-overlay ${isModalOpen ? "show" : ""}`} onClick={handleBurgerClick}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ul>
            <li>
              <Link
                to="/projects"
                onClick={handleBurgerClick}
                className={isActive("/projects") ? "active" : ""}
              >
                <img src={icon_projects} alt="Проекты" className="icon" />
                <span>Проекты</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={handleBurgerClick}
                className={isActive("/profile") ? "active" : ""}
              >
                <img src={icon_profile} alt="Личный кабинет" className="icon" />
                <span>Личный кабинет</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  handleBurgerClick();
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("user_role");
                }}
                className={isActive("/") ? "active" : ""}
              >
                <img src={icon_exit} alt="Выйти" className="icon" />
                <span>Выйти</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
