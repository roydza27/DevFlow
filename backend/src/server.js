const express = require('express');
const mongoose = require('mongoose');
const taskModel = require('./models/Task');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
const result = dotenv.config()

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Define middleware
app.use(express.json());

// Define routes
const taskController = require('./controllers/TaskController');
app.use('/tasks', taskController);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});
