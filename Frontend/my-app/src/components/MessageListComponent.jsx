import React from 'react';
import '../styles/MessageListComponent.css';

const MessageListComponent = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <p>{msg.text}</p>
          {msg.location && (
            <p className="message-location">
              Location: Latitude {msg.location.latitude}, Longitude {msg.location.longitude}
            </p>
          )}
          {msg.destination && (
            <p className="message-destination">
              Destination: Latitude {msg.destination.latitude}, Longitude {msg.destination.longitude}
            </p>
          )}
          <p className="message-createdAt">
            Created At: {new Date(msg.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageListComponent;
