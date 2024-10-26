import React from 'react';
import { Link } from "react-router-dom";
import './AdminMenu.css';

import addIcon from './../../images/icons/icon_plus.svg';

const AdminMenu: React.FC = () => {
  return (
    <div className="menu-container">
      <h1 className='menu-title'>Панель администратора</h1>
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/users" className="menu-link">
            <span className='title-link'>Участники</span>
            <div className="add-container">
              <Link to="/specialist?add=true" className="add-button">
                <img src={addIcon} alt="Add" className="add-icon" />
                Добавить
              </Link>
            </div> 
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/projects" className="menu-link">
            <span className='title-link'>Проекты</span>
            <div className="add-container">
              <Link to="/project?add=true" className="add-button">
                <img src={addIcon} alt="Add" className="add-icon" />
                Добавить
              </Link>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
