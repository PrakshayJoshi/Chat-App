const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getMessages);
router.post('/send', messageController.sendMessage);
router.patch('/:id', messageController.updateMessage);

module.exports = router;
