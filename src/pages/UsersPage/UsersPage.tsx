import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { fetchUsers, User } from '../../api/user/userApi';
import './UsersPage.css';
import RoleManager from '../../components/RoleManager/RoleManager';

const UserPage: React.FC = () => {
  const location = useLocation();
  const { tasks, projectId } = location.state || { tasks: [], projectId: null };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {

    // Получение данных о пользователях при монтировании компонента
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      }
    };

    loadUsers();
  }, [tasks, projectId]);

  const breadcrumbs = [
    { name: 'Панель администратора', path: '/main-admin-panel' },
    { name: 'Участники', path: '/users' },
  ];

  return (
    <div className="user-page">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div className="control-panel">
        <p className="control-panel_title">Участники</p>
      </div>
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{`${user.lastName} ${user.firstName} ${user.middleName}`}</td>
              <td>
                <RoleManager role={user.role ?? "Гость"} disabled={user.role === 'ADMIN'} />              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;
