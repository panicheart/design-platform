import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

export const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { type, title, description, content } = req.body;

  if (!type || !title || !description || !content) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const validTypes = ['human', 'time', 'material', 'component', 'product', 'knowledge'];
  if (!validTypes.includes(type)) {
    return next(new AppError('Invalid resource type', 400));
  }

  next();
};

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    description,
    type,
    assignedTo,
    startDate,
    dueDate,
  } = req.body;

  if (!title || !description || !type || !assignedTo || !startDate || !dueDate) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const validTypes = [
    'new_product',
    'model_development',
    'circuit_verification',
    'issue_handling',
    'testing',
    'technical_cooperation',
  ];
  if (!validTypes.includes(type)) {
    return next(new AppError('Invalid task type', 400));
  }

  if (new Date(startDate) > new Date(dueDate)) {
    return next(new AppError('Start date must be before due date', 400));
  }

  next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, department, position } = req.body;

  if (!username || !email || !password || !department || !position) {
    return next(new AppError('Please provide all required fields', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  next();
}; 