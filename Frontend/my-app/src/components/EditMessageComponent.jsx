import React, { useState } from 'react';
// import '../styles/EditMessageComponent.css';

const EditMessageComponent = ({ message, saveEditMessage, cancelEditMessage }) => {
  const [editedMessage, setEditedMessage] = useState(message.text);

  const handleSave = () => {
    saveEditMessage({ ...message, text: editedMessage });
  };

  return (
    <div className="edit-message-container">
      <input
        type="text"
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={cancelEditMessage}>Cancel</button>
    </div>
  );
};

export default EditMessageComponent;
