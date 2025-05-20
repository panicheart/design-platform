import { Request, Response, NextFunction } from 'express';

export const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { title, type, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!type) {
    return res.status(400).json({ message: 'Type is required' });
  }

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  next();
}; 