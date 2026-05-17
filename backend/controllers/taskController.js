const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    const filter = { userId: req.user._id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('GetTasks error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({
      message: 'Task retrieved successfully',
      task
    });
  } catch (error) {
    console.error('GetTask error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const createTask = async (req, res) => {
  try {
    console.log('CreateTask request body:', req.body);
    console.log('User from auth middleware:', req.user);
    
    const { title, description, priority, deadline } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log('Creating task with:', { title, description, priority, deadline, userId: req.user._id });
    
    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      userId: req.user._id
    });
    
    console.log('Task created successfully:', task);
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('CreateTask error:', error);
    console.error('Error message:', error.message);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, subtasks } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, status, priority, deadline, subtasks },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('UpdateTask error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('DeleteTask error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Task.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    };
    
    res.status(200).json({
      message: 'Task statistics retrieved successfully',
      stats: result
    });
  } catch (error) {
    console.error('GetTaskStats error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
