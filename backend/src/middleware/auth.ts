import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; role: string };
    const user = await User.findById(decoded.id) as IUser;

    if (!user) {
      throw new Error();
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
}; 