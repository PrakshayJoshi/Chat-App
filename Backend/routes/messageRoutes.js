const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/send', async (req, res) => {
  const { text, location } = req.body;
  try {
    const newMessage = new Message({ text, location });
    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
