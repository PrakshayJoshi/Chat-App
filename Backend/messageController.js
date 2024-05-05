const Message = require('./Message');

exports.sendMessage = async (req, res) => {
    const { text } = req.body;
    
    try {
        console.log('Received message:', text);
      
        const message = new Message({ text });
        await message.save();
        console.log('Message saved:', message);
      
        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Failed to retrieve messages:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
