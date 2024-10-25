import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import icon1 from "../../images/icons/icon1.svg";
// import icon2 from "../../images/icons/icon2.svg";
// import icon3 from "../../images/icons/icon3.svg";
// import icon4 from "../../images/icons/icon4.svg";
import icon_projects from "../../images/icons/icon_projects.svg";
// import icon6 from "../../images/icons/icon_tasks.svg";
// import icon7 from "../../images/icons/icon_documents.svg";
import icon_profile from "../../images/icons/icon_profile.svg";
import icon_exit from "../../images/icons/icon_exit.svg";
import open from "../../images/icons/icon_open.svg";
import close from "../../images/icons/icon_close.svg";
import { SidebarContext } from "../SidebarContext/SidebarContext";
import { useLayout } from "../Context/LayoutContext";
import "../Sidebar/Sidebar.css";

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const { showSidebar } = useLayout();
  const userRole = localStorage.getItem("user_role");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  if (!showSidebar) {
    return null;
  }

  const renderMenuItems = () => {
    switch (userRole) {
      case "ADMIN":
        return (
          <>
            <li>
              <Link
                to="/specialist"
                onClick={() => setActiveLink("/specialist")}
                className={activeLink === "/specialist" ? "active" : ""}
              >
                {/* <img src={icon1} alt="icon1" className="icon" /> */}
                <p>Специалисты</p>
              </Link>
            </li>
            <li>
              <Link
                to="/interns"
                onClick={() => setActiveLink("/interns")}
                className={activeLink === "/interns" ? "active" : ""}
              >
                {/* <img src={icon2} alt="icon2" className="icon" /> */}
                <p>Стажёры</p>
              </Link>
            </li>
            <li>
              <Link
                to="/trainee"
                onClick={() => setActiveLink("/trainee")}
                className={activeLink === "/trainee" ? "active" : ""}
              >
                {/* <img src={icon3} alt="icon3" className="icon" /> */}
                <p>Практиканты</p>
              </Link>
            </li>
            <li>
              <Link
                to="/customer"
                onClick={() => setActiveLink("/customer")}
                className={activeLink === "/customer" ? "active" : ""}
              >
                {/* <img src={icon4} alt="icon4" className="icon" /> */}
                <p>Заказчики</p>
              </Link>
            </li>
            <li>
              <Link
                to="/project"
                onClick={() => setActiveLink("/project")}
                className={activeLink === "/project" ? "active" : ""}
              >
                {<img src={icon_projects} alt="icon_projects" className="icon" />}
                <p>Проекты</p>
              </Link>
            </li>
          </>
        );
      case "SPECIALIST":
        return (
          <>
            <li>
              <Link
                to="/project_view"
                onClick={() => setActiveLink("/project_view")}
                className={activeLink === "/project_view" ? "active" : ""}
              >
                {/* <img src={icon5} alt="icon5" className="icon" /> */}
                <p>Проекты</p>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                onClick={() => setActiveLink("/tasks")}
                className={activeLink === "/tasks" ? "active" : ""}
              >
                {/* <img src={icon6} alt="icon6" className="icon" /> */}
                <p>Задачи</p>
              </Link>
            </li>
          </>
        );
      case "CUSTOMER":
        return (
          <>
            <li>
              <Link
                to="/project_view"
                onClick={() => setActiveLink("/project_view")}
                className={activeLink === "/project_view" ? "active" : ""}
              >
                {/* <img src={icon5} alt="icon5" className="icon" /> */}
                <p>Проекты</p>
              </Link>
            </li>
            <li>
              <Link
                to="/documents"
                onClick={() => setActiveLink("/documents")}
                className={activeLink === "/documents" ? "active" : ""}
              >
                {/* <img src={icon7} alt="icon7" className="icon" /> */}
                <p>Документы</p>
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <button
        className={`sidebar-toggle ${isSidebarOpen ? "openBth" : ""}`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <img src={open} alt="open" className="toggle-icon"/>
        ) : (
          <img src={close} alt="close" className="toggle-icon" />
        )}
      </button>
      <ul>{renderMenuItems()}</ul>
      <ul className="sidebar-footer">
        <li>
          <Link
            to="/profile"
            onClick={() => setActiveLink("/profile")}
            className={activeLink === "/profile" ? "active" : ""}
          >
            { <img src={icon_profile} alt="icon_profile" className="icon" /> }
            <p>Личный кабинет</p>
          </Link>
        </li>
        <li>
          <Link
            to="/"
            onClick={() => {
              setActiveLink("/");
              localStorage.removeItem("access_token");
              localStorage.removeItem("user_role");
            }}
            className={activeLink === "/" ? "active" : ""}
          >
            {<img src={icon_exit} alt="icon_exit" className="icon" />}
            <p>Выйти</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
