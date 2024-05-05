import React, { useState, useEffect } from 'react';
import '../styles/home.css';

const HomePage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
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

    const sendMessage = async () => {
        if (message.trim() !== '') {
            try {
                // Request user's location
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = { latitude, longitude };

                    // Send message along with location to backend
                    const response = await fetch('http://localhost:9000/api/messages/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: message, location })
                    });
                    const data = await response.json();
                    console.log('Success:', data);
                    if (data.success) {
                        // Update messages state with new message
                        setMessages([...messages, data.message]);
                    }
                    setMessage('');
                }, (error) => {
                    console.error('Error getting location:', error);
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div>
            <h2>Home Page</h2>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={handleKeyDown}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            
            // Inside HomePage component
<div>
    {loading ? (
        <p>Loading...</p>
    ) : error ? (
        <p>Error: {error}</p>
    ) : (
        messages.map((msg, index) => (
            <div key={index}>
                <p>{msg.text}</p>
                {msg.location && msg.location.latitude && msg.location.longitude ? (
                    <p>Location: {msg.location.latitude}, {msg.location.longitude}</p>
                ) : (
                    <p>Location not available</p>
                )}
            </div>
        ))
    )}
</div>


        </div>
    );
};

export default HomePage;
