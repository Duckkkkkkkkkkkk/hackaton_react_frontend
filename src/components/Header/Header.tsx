import React from "react";
import "./Header.css";
import icon_geryon from "../../images/icons/icon_geryon.svg";
import icon_webpraktik from "../../images/icons/icon_webpraktik.svg"
import { useLayout } from '../Context/LayoutContext';

const Header: React.FC = () => {
  const { showHeader } = useLayout();

  if (!showHeader) {
    return null;
  }

  return (
    <header className="header">
      {<img className="icon_webpraktik" src={icon_webpraktik} alt="webpractice" />}
    </header>
  );
};

export default Header;
