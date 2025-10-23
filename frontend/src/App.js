import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    checkHealth();
    fetchTasks();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({ status: 'Error', message: 'Cannot connect to backend' });
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const result = await response.json();
      if (result.success) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      alert('Failed to connect to backend API');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });

      const result = await response.json();

      if (result.success) {
        setTasks([...tasks, result.data]);
        setNewTask('');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task');
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const result = await response.json();

      if (result.success) {
        setTasks(tasks.map(t => 
          t.id === taskId ? result.data : t
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Task Manager</h1>
          <div className="health-status">
            <strong>Backend Status:</strong>{' '}
            <span className={`status ${health?.status === 'OK' ? 'healthy' : 'error'}`}>
              {health ? `${health.status} - ${health.message}` : 'Checking...'}
            </span>
          </div>
        </header>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="task-input"
          />
          <button type="submit" className="add-button">
            Add Task
          </button>
        </form>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className={task.completed ? 'completed' : ''}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="deployment-info">
          <p>
            <strong>Frontend:</strong> Deployed on Vercel<br />
            <strong>Backend:</strong> Deployed on Render
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;