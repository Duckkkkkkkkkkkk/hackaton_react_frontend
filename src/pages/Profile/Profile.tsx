import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import AdminForm from "../../components/Profile/AdminForm";
import CustomerForm from "../../components/Profile/CustomerForm";
import SpecialistForm from "../../components/Profile/SpecialistForm";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";

import "./Profile.css";

const Profile: React.FC = () => {
  useLogout();
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) {
      setUserRole(storedRole);
    } else {
      navigate("/*");
    }
  }, [navigate]);

  if (!["ADMIN", "CUSTOMER", "SPECIALIST", "GUEST"].includes(userRole)) {
    navigate("/*");
    return null;
  }

  let profileComponent;
  switch (userRole) {
    case "ADMIN":
      profileComponent = <AdminForm />;
      break;
    case "CUSTOMER":
      profileComponent = <CustomerForm />;
      break;
    case "SPECIALIST":
      profileComponent = <SpecialistForm />;
      break;
    default:
      profileComponent = null;
      break;
  }

  const breadcrumbs =
    userRole === "ADMIN"
      ? [
          { name: "Панель администратора", path: "/main-admin-panel" },
          { name: "Личный кабинет", path: "/profile" },
        ]
      : [{ name: "Личный кабинет", path: "/profile" }];

  return (
    <div className="profile">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      {profileComponent}
    </div>
  );
};

export default Profile;
