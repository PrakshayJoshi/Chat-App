// Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index the location field for geospatial queries
messageSchema.index({ location: '2dsphere' });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
