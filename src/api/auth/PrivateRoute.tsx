import React from 'react';
import { Navigate, Route } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  roles: string[];
} 

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
  const userRole = localStorage.getItem('user_role');

  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="*" replace />;
  }

  return element;
};

export default PrivateRoute;
