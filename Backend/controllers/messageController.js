  const Message = require('../models/Message');
  const { isLocationWithinBoundary } = require('../utils/locationUtils');
  
  exports.sendMessage = async (req, res) => {
    const { text, location, destination, boundary } = req.body;
  
    if (!text || !location || !location.latitude || !location.longitude || !destination || !destination.latitude || !destination.longitude) {
      console.log('Validation Error:', { text, location, destination });
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const message = new Message({ text, location, destination, boundary });
      await message.save();
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  exports.getMessages = async (req, res) => {
    const { userId, latitude, longitude } = req.query;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
  
      const filteredMessages = messages.filter((message) =>
        isLocationWithinBoundary({ latitude, longitude }, message.boundary)
      );
  
      res.json(filteredMessages);
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  };
  

  exports.updateMessage = async (req, res) => {
    const { id } = req.params;
    const { text, location, destination } = req.body;

    try {
      let message = await Message.findById(id);

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      if (text) message.text = text;
      if (location) message.location = location;
      if (destination) message.destination = destination;

      await message.save();
      res.status(200).json({ success: true, message: 'Message updated successfully', updatedMessage: message });
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
