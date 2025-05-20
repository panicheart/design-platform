import express from 'express';
import { Request, Response } from 'express';
import { validateResource } from '../middleware/validation';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

interface IResource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  department: string;
  tags: string[];
  version: number;
  metadata: Record<string, any>;
  accessControl: {
    visibility: string;
    allowedUsers: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IDatabase {
  resources: IResource[];
}

const router = express.Router();

// 获取所有资源
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const resources = db.resources;
    res.json(resources);
  } catch (error) {
    logger.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

// 获取单个资源
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const resource = db.resources.find((r: IResource) => r.id === req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    logger.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Error fetching resource' });
  }
});

// 创建资源
router.post('/', validateResource, async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const newResource: IResource = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error) {
    logger.error('Error creating resource:', error);
    res.status(500).json({ message: 'Error creating resource' });
  }
});

// 更新资源
router.put('/:id', validateResource, async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const index = db.resources.findIndex((r: IResource) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    const updatedResource: IResource = {
      ...db.resources[index],
      ...req.body,
      updatedAt: new Date()
    };
    db.resources[index] = updatedResource;
    res.json(updatedResource);
  } catch (error) {
    logger.error('Error updating resource:', error);
    res.status(500).json({ message: 'Error updating resource' });
  }
});

// 删除资源
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await connectDB() as unknown as IDatabase;
    const index = db.resources.findIndex((r: IResource) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    db.resources.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
});

export default router; 