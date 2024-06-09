import React from 'react';

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
          <p className="message-timestamp">Time: {new Date(msg.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageListComponent;
