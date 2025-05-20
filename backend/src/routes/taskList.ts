import { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

interface TaskList {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implement task list listing
    const taskLists: TaskList[] = [];
    res.json(taskLists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task lists' });
  }
});

export default router; 