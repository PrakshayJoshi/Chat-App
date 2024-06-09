import React from 'react';
import '../styles/LogoutButtonComponent.css';

const LogoutButtonComponent = ({ handleLogout }) => {
  return <button className="logout-button" onClick={handleLogout}>Logout</button>;
};

export default LogoutButtonComponent;
