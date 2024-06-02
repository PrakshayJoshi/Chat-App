import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, setUser } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:9000/api/auth/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUser({ id: data.user.id });
            localStorage.setItem('userId', data.user.id); // Ensure userId is stored in localStorage
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        });
    }
  }, [navigate, setUser]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messages.forEach((msg, index) => {
      console.log(`Message ${index} Location:`, msg.location);
    });
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(updateLocation, 30000); // Update location every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }

    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log('Updating location for user:', userId); // Add logging to verify userId
      const response = await fetch(`http://localhost:9000/api/users/${userId}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (response.ok) {
        console.log('Location updated');
      } else {
        console.error('Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const location = await getCurrentLocation();
        const messageObject = {
          text: message,
          location: location,
        };

        const response = await fetch('http://localhost:9000/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageObject),
        });

        const data = await response.json();
        console.log('Success:', data);
        if (data.success) {
          setMessages([data.message, ...messages]);
        }
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Welcome</h1>
      <h2 className="home-header">Home Page</h2>
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message-item">
            <p>{msg.text}</p>
            {msg.location && (
              <p>
                Location: Latitude {msg.location.latitude}, Longitude {msg.location.longitude}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
