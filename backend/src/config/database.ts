import mongoose from 'mongoose';
import logger from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/design-platform';

// 连接选项
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // 连接池大小
  serverSelectionTimeoutMS: 5000, // 服务器选择超时
  socketTimeoutMS: 45000, // Socket 超时
};

// 连接事件处理
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// 进程终止时关闭连接
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

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
  users: IUser[];
  resources: IResource[];
  tasks: ITask[];
}

// 内存数据库
const db: IDatabase = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5YxX', // 'admin123'
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      status: 'active',
      permissions: ['read', 'write', 'admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  resources: [
    {
      id: '1',
      title: 'Sample Resource',
      description: 'This is a sample resource',
      type: 'document',
      category: 'general',
      status: 'active',
      filePath: '/uploads/sample.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      uploadedBy: '1',
      department: 'IT',
      tags: ['sample', 'document'],
      version: 1,
      metadata: {
        author: 'Admin',
        created: new Date()
      },
      accessControl: {
        visibility: 'public',
        allowedUsers: ['1']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Sample Task',
      description: 'This is a sample task',
      type: 'development',
      status: 'in-progress',
      priority: 'high',
      assignedTo: '1',
      createdBy: '1',
      department: 'IT',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      actualHours: 0,
      dependencies: [],
      attachments: [],
      milestones: [
        {
          title: 'First Milestone',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          completed: false
        }
      ],
      tags: ['sample', 'development'],
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}; 