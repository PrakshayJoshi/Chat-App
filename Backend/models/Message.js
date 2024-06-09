// models/Message.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    destination: {
        type: locationSchema,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
