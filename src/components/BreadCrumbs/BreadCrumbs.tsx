import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../BreadCrumbs/BreadCrumbs.css";
import separatorIcon from "./../../images/icons/icon_separator.svg";

interface Breadcrumb {
  name: string;
  path: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const BreadCrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const handleBreadcrumbClick = (path: string) => {
  //   navigate(path);
  // };

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (breadcrumb.onClick) {
      breadcrumb.onClick();
    } else {
      navigate(breadcrumb.path);
    }
  };

  const isMainPanel = location.pathname === '/main-admin-panel';

  return (
    <div className={`breadcrumb-container ${isMainPanel ? "main-panel" : "sub-page"}`}>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <span
            className={`breadcrumb-title ${index === breadcrumbs.length - 1 ? "breadcrumb-current" : ""}`}
            onClick={() => handleBreadcrumbClick(breadcrumb)}
          >
            {breadcrumb.name}
          </span>
          <img
            src={separatorIcon}
            alt="Separator"
            className="breadcrumb-separator"
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadCrumbs;
