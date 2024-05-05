
const express = require('express');
const router = express.Router();
const messageController = require('./messageController'); // Ensure correct path

// Route for sending a message
router.post('/send', messageController.sendMessage);

// Route for getting messages
router.get('/', messageController.getMessages);

module.exports = router;
