const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const messageRoutes = require('./messageRoutes'); // Ensure correct path

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/messages', messageRoutes); // Use message routes

module.exports = app;
