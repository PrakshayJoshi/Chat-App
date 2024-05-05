// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const messageRoutes = require('./messageRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
