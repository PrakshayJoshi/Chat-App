import React from 'react';
import '../styles/MessageListComponent.css';

const MessageListComponent = ({ messages, startEditMessage }) => {
  return (
    <ul className="message-list">
      {messages.map((message) => (
        <li key={message._id} className="message-item">
          <p>{message.text}</p>
          <button onClick={() => startEditMessage(message)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default MessageListComponent;
