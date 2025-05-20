import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
  position: string;
  status: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IDatabase {
  users: IUser[];
}

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, department, position } = req.body;
    const db = await connectDB() as unknown as IDatabase;

    // Check if user already exists
    const existingUser = db.users.find(
      (u: IUser) => u.email === email || u.username === username
    );
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: IUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      department,
      position,
      status: 'active',
      permissions: ['read'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.users.push(newUser);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position
      }
    });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB() as unknown as IDatabase;

    // Find user
    const user = db.users.find((u: IUser) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position
      }
    });
  } catch (error) {
    logger.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router; 