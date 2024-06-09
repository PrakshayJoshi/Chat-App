import React from 'react';
import '../styles/MessageInputComponent.css';

const MessageInputComponent = ({ message, setMessage, handleKeyDown, sendMessage }) => {
  return (
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
  );
};

export default MessageInputComponent;
