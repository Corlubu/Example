const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://your-frontend-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Sample data
let tasks = [
  { id: 1, title: 'Learn React', completed: true },
  { id: 2, title: 'Build API with Express', completed: false },
  { id: 3, title: 'Deploy to Render', completed: false }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running on Render',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    count: tasks.length
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: tasks[taskIndex]
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});