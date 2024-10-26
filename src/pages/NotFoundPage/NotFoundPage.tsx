import React, { useEffect } from "react";
import { useLayout } from "../../components/Context/LayoutContext";
import "./styles/NotFoundPage.css";

import { useLogout } from "../../hooks/useLogout";

const NotFoundPage: React.FC = () => {
  useLogout();
  const { setShowHeader, setShowSidebar } = useLayout();

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);

    return () => {
      setShowHeader(true);
      setShowSidebar(true);
    };
  }, [setShowHeader, setShowSidebar]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="text">
          <p className="title404">404</p>
          <p className="subtitle">Страница не найдена.</p>
          <p className="description">Извините, такой страницы не существует.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
