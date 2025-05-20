import express from 'express';
import { Request, Response } from 'express';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

interface ITask {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdBy: string;
  department: string;
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  attachments: string[];
  milestones: {
    title: string;
    dueDate: Date;
    completed: boolean;
  }[];
  tags: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IDatabase {
  tasks: ITask[];
}

const router = express.Router();

// 获取所有任务
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const tasks = db.tasks;
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// 获取单个任务
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const task = db.tasks.find((t: ITask) => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    logger.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// 创建任务
router.post('/', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const newTask: ITask = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// 更新任务
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const index = db.tasks.findIndex((t: ITask) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updatedTask: ITask = {
      ...db.tasks[index],
      ...req.body,
      updatedAt: new Date()
    };
    db.tasks[index] = updatedTask;
    res.json(updatedTask);
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// 删除任务
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const index = db.tasks.findIndex((t: ITask) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    db.tasks.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router; 