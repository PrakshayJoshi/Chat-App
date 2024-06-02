import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { user } = useUser();
  console.log('User in PrivateRoute:', user);

  return user ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
