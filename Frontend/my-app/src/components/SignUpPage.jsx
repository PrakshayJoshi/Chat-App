import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/SignUpPage.css";

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const location = await getCurrentLocation();
      const response = await fetch('http://localhost:9000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, location }), // Include location in the request body
      });

      const data = await response.json();
      if (data.success) {
        navigate('/login');
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup: ' + error.message);
    }
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude],
            });
          },
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };
 
  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <input className="signup-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input className="signup-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="signup-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="signup-button" onClick={handleSignup}>Signup</button>
      <p>Already have an account? <button className="toggle-button" onClick={() => navigate('/login')}>Login</button></p>
    </div>
  );
};

export default SignUpPage;
