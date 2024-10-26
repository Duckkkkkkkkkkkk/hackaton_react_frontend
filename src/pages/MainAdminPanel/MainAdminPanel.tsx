import React from "react";
import { useLogout } from "../../hooks/useLogout";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import Footer from "../../components/Footer/Footer";
import AdminMenu from "../../components/AdminMenu/AdminMenu";

const MainAdminPanel: React.FC = () => {
  useLogout();
  const breadcrumbs = [
    { name: "Панель администратора", path: "/main-admin-panel" },
  ];

  return (
    <div className="main-admin">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <AdminMenu />
      <Footer />
    </div>
  );
};

export default MainAdminPanel;
