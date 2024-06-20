import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import MessageInputComponent from './MessageInputComponent';
import SearchPlaceComponent from './SearchPlaceComponent';
import MessageListComponent from './MessageListComponent';
import LogoutButtonComponent from './LogoutButtonComponent';
import EditMessageComponent from './EditMessageComponent';

const HomePage = () => {
  const { setUser } = useUser();
  const [user, setUserState] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState(null);
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);

  const updateLocation = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found in localStorage');
      return;
    }

    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log('Updating location for user:', userId);
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
  }, []);

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
            setUser({ id: data.user.id, username: data.user.username });
            localStorage.setItem('userId', data.user.id);
            setUserState({ id: data.user.id, username: data.user.username });
            setLoading(false);
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
    const intervalId = setInterval(updateLocation, 30000);
    return () => clearInterval(intervalId);
  }, [updateLocation]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError(error.message);
      setLoading(false);
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
        const createdAt = new Date().toISOString();
        const messageObject = {
          text: message,
          location: location,
          destination: destination,
          boundary: destination ? { // Add boundary information
            type: 'rectangle',
            coordinates: destination.boundary // Using the destination's boundary
          } : null,
          createdAt: createdAt,
          userId: user.id
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
          setMessage('');
          setDestination(null); // Clear the destination after sending the message
          const searchBox = document.querySelector('input[type="text"][placeholder="Search for a place"]');
          if (searchBox) {
            searchBox.value = ''; // Clear the search box
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const startEditMessage = (message) => {
    setEditingMessage(message);
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
  };

  const saveEditMessage = async (updatedMessage) => {
    try {
      const response = await fetch(`http://localhost:9000/api/messages/${updatedMessage._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMessage),
      });

      if (response.ok) {
        const updatedMessages = messages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        );
        setMessages(updatedMessages);
        setEditingMessage(null);
      } else {
        console.error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const fetchNearbyUsers = async () => {
    if (!destination) return;

    try {
      const { latitude, longitude, boundary } = destination;
      const queryParams = new URLSearchParams({
        latitude,
        longitude,
        northeast: JSON.stringify(boundary.northeast),
        southwest: JSON.stringify(boundary.southwest)
      });

      const response = await fetch(`http://localhost:9000/api/users/nearby?${queryParams.toString()}`);
      const data = await response.json();
      if (data.success) {
        setNearbyUsers(data.users);
      } else {
        console.error('Failed to fetch nearby users');
      }
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome {user && user.username}</h1>
      <h2 className="home-header">Home Page</h2>
      <MessageInputComponent
        message={message}
        setMessage={setMessage}
        handleKeyDown={handleKeyDown}
        sendMessage={sendMessage}
      />
      <SearchPlaceComponent setDestination={setDestination} />
      <button onClick={fetchNearbyUsers}>Find Nearby Users</button>
      {nearbyUsers.length > 0 && (
        <div className="nearby-users">
          <h3>Users near the destination:</h3>
          <ul>
            {nearbyUsers.map((user) => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <MessageListComponent messages={messages} startEditMessage={startEditMessage} />
      {editingMessage && (
        <EditMessageComponent
          message={editingMessage}
          saveEditMessage={saveEditMessage}
          cancelEditMessage={cancelEditMessage}
        />
      )}
      <LogoutButtonComponent handleLogout={handleLogout} />
    </div>
  );
};

export default HomePage;
