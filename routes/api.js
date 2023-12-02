const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific task by ID
router.get('/tasks/:id', getTask, (req, res) => {
    res.json(res.task);
});

// POST a new task
router.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a task by ID
router.patch('/tasks/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }

    if (req.body.description != null) {
        res.task.description = req.body.description;
    }

    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a task by ID
router.delete('/tasks/:id', getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to get a task by ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.task = task;
    next();
}

module.exports = router;
