import React from 'react';
import '../styles/MessageInputComponent.css';

const MessageInputComponent = ({ message, setMessage, handleKeyDown, sendMessage }) => {
  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInputComponent;
