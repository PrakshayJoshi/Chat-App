import React, { useState } from 'react';
import '../styles/EditMessageComponent.css';

const EditMessageComponent = ({ message, saveEditMessage, cancelEditMessage }) => {
  const [updatedMessage, setUpdatedMessage] = useState(message);

  const handleSave = () => {
    saveEditMessage(updatedMessage);
  };

  return (
    <div className="edit-message">
      <textarea
        value={updatedMessage.text}
        onChange={(e) => setUpdatedMessage({ ...updatedMessage, text: e.target.value })}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={cancelEditMessage}>Cancel</button>
    </div>
  );
};

export default EditMessageComponent;
