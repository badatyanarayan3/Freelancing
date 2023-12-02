const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB (replace 'mongodb://localhost:27017/your-database-name' with your actual MongoDB URL)
mongoose.connect('mongodb://badatyanarayan3:Chandini@3580@localhost:27017/freelancer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Mongoose schema and model for tasks
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Task = mongoose.model('Task', taskSchema);

// Sample user data (replace this with your actual user data)
const users = [
    {
        id: 1,
        username: 'exampleUser',
        password: '$2b$10$rHMZoKvaUOeP/Ow/b3PKgeTlhYd9u1EdjstetgyMPiy/uy0vWZIte', // Hashed password
    },
];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, 'secretKey');
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Protected route
app.get('/api/protected', (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        res.json({ message: 'You accessed a protected route!', user: decoded });
    });
});

// CRUD routes for tasks (you can extend these routes)
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
