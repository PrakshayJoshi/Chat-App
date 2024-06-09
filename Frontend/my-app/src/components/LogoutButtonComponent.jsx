import React from 'react';

const LogoutButtonComponent = ({ handleLogout }) => {
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButtonComponent;
