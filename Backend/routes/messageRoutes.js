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
    const { text, location, destination } = req.body;

    if (!text || !location || !location.latitude || !location.longitude || !destination || !destination.latitude || !destination.longitude) {
        console.log('Validation Error:', { text, location, destination });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const message = new Message({
            text,
            location,
            destination
        });

        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

