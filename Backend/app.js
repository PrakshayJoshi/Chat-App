// Backend (Node.js with Express and Axios)
const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
const messageRoutes = require('./messageRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Reverse geocoding function
const reverseGeocode = async (latitude, longitude) => {
    try {
        const apiKey = 'AIzaSyDHiCf22dC0aPtm8pYoqDnm94rtac_RdyY'; // Your API key for the geocoding service
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        const response = await axios.get(url);
        const address = response.data.results[0].formatted_address; // Extract the formatted address from the response
        return address;
    } catch (error) {
        console.error('Error performing reverse geocoding:', error);
        return null;
    }
};

// Middleware to add address to messages
app.use(async (req, res, next) => {
    const messages = req.body; // Assuming messages are sent in the request body
    for (const message of messages) {
        if (message.location && message.location.latitude && message.location.longitude) {
            const address = await reverseGeocode(message.location.latitude, message.location.longitude);
            message.address = address; // Add address property to message object
        }
    }
    next();
});

// Routes
app.use('/api/messages', messageRoutes);

module.exports = app;
