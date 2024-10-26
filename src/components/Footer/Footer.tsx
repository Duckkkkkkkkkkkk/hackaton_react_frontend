import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

import icon_profile from "../../images/icons/icon_profile.svg";
import exitIcon from "../../images/icons/icon_exit.svg";

const Footer: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    window.location.href = '/';
  };

  return (
    <div className="footer">
      <ul>
        <li>
          <Link to="/profile" className='link'>
            <img src={icon_profile} alt="icon1" className='icon' />
            Личный кабинет
          </Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogout} className='link'>
            <img src={exitIcon} alt="icon2" className='icon' />
            Выйти
          </Link>
        </li>
      </ul>  
    </div>
  );
};

export default Footer;
