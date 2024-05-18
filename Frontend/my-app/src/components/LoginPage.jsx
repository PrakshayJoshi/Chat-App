import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({ emailOrUsername: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', name: '', surname: '' });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
  };

  const handleLogin = () => {
    // Perform login logic here
    // If login is successful, navigate to the home page
    navigate('/home');
  };

  const handleSignUp = () => {
    // Perform signup logic here
    // If signup is successful, navigate to the home page or login page
    navigate('/home');
  };

  return (
    <div className="login-container">
      <h2 className="login-header">{isSignUp ? 'Sign Up' : 'Login'}</h2>
      
      {isSignUp ? (
        <div className="form">
          <input
            type="text"
            name="name"
            value={signUpForm.name}
            onChange={handleSignUpChange}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="text"
            name="surname"
            value={signUpForm.surname}
            onChange={handleSignUpChange}
            placeholder="Surname"
            className="input-field"
          />
          <input
            type="email"
            name="email"
            value={signUpForm.email}
            onChange={handleSignUpChange}
            placeholder="Email"
            className="input-field"
          />
          <input
            type="password"
            name="password"
            value={signUpForm.password}
            onChange={handleSignUpChange}
            placeholder="Password"
            className="input-field"
          />
          <button className="login-button" onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div className="form">
          <input
            type="text"
            name="emailOrUsername"
            value={loginForm.emailOrUsername}
            onChange={handleLoginChange}
            placeholder="Email or Username"
            className="input-field"
          />
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="Password"
            className="input-field"
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
      )}
      
      <button className="toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
      </button>
    </div>
  );
};

export default LoginPage;
