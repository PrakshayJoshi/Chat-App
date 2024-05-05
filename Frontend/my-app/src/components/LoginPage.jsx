import '../styles/login.css'; 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic if needed
    // Redirect to the home page
    navigate('/home');
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Login Page</h2>
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
  