const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
    title: String,
    description: String
});

const Task = mongoose.model('Task', taskSchema);

// CRUD routes
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task' });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.json(task);
    } catch (err) {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

// Error middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
