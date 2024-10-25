import React from "react";
import "./Header.css";
import icon_geryon from "../../images/icons/icon_geryon.svg";
import { useLayout } from '../Context/LayoutContext';

const Header: React.FC = () => {
  const { showHeader } = useLayout();

  if (!showHeader) {
    return null;
  }

  return (
    <header className="header">
      <p>LOGO</p>
      {/* <img src={icon_geryon} alt="geryon" /> */}
    </header>
  );
};

export default Header;
