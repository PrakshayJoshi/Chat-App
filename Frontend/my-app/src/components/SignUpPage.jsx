import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';  // Import the CSS file

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const locationPermission = await getLocationPermission();
      if (locationPermission) {
        const location = await getCurrentLocation();
        const signupData = {
          username,
          email,
          password,
          location,
        };
        const response = await fetch('http://localhost:9000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Signup failed');
        }
        console.log('Signup successful:', data);
        navigate('/home');
      } else {
        console.log('Location permission denied.');
        alert('Location permission is required to sign up.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert(`Signup failed: ${error.message}`);
    }
  };

  const getLocationPermission = async () => {
    return new Promise((resolve) => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          resolve(permissionStatus.state === 'granted');
        });
      } else if ('geolocation' in navigator) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpPage;
