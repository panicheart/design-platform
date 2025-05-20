import express from 'express';
import Task from '../models/Task';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, assignedTo } = req.query;
    const query: any = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// Add comment to task
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      content: req.body.content,
      author: req.user._id,
      createdAt: new Date(),
    });

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
});

// Update task progress
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.progress = req.body.progress;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error });
  }
});

export default router; 