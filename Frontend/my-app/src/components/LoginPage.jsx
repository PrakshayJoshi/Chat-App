import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id); // Set userId in localStorage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
    <h2 className="login-header">Login</h2>
    <input
      className="login-input"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
    />
    <input
      className="login-input"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
    />
    <button className="login-button" onClick={handleLogin}>Login</button>
    <p>Don't have an account? <button className="toggle-button" onClick={() => navigate('/signup')}>Signup</button></p>
  </div>
  );
};

export default LoginPage;
