import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { auth } from './middleware/auth';
import resourceRoutes from './routes/resources';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';
import matter from 'gray-matter';

const app = express();
const port = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
mongoose.connect('mongodb://localhost:27017/department-platform')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 类型定义
interface UserTags {
  [key: string]: string[];
}

interface ProjectMembers {
  [key: string]: string[];
}

interface WarningRule {
  id: string;
  name: string;
  threshold: number;
  operator: '<' | '>' | '=' | '<=';
  level: 'error' | 'warning' | 'info';
  message: string;
  details: string;
  enabled: boolean;
  tags: string[];
}

interface WarningRules {
  hardwareRules: WarningRule[];
  softwareRules: WarningRule[];
  projectRules: WarningRule[];
}

interface WarningNotification {
  id: string;
  ruleId: string;
  timestamp: string;
  message: string;
  details: string;
  level: 'error' | 'warning' | 'info';
  projectId: string;
  notifiedUsers: string[];
  status: 'pending' | 'processing' | 'resolved';
}

// 用户标签数据
const userTags: UserTags = {
  'user1': ['功放设计', 'PCB设计', '硬件调试'],
  'user2': ['功放设计', '射频设计', 'EMC测试'],
  'user3': ['软件架构', '嵌入式开发', '驱动开发'],
  'user4': ['测试开发', '自动化测试', '性能测试'],
};

// 项目成员数据
const projectMembers: ProjectMembers = {
  'project1': ['user1', 'user3', 'user4'],
  'project2': ['user2', 'user3'],
};

// 预警规则配置
const warningRules: WarningRules = {
  hardwareRules: [
    {
      id: 'hw-001',
      name: 'schemeReviewRate',
      threshold: 85,
      operator: '<',
      level: 'error',
      message: 'hardwareDesignRisk',
      details: 'pcbDesignDelay',
      enabled: true,
      tags: ['功放设计', 'PCB设计'],
    },
    {
      id: 'hw-002',
      name: 'pcbSuccessRate',
      threshold: 90,
      operator: '<',
      level: 'warning',
      message: 'hardwareQualityRisk',
      details: 'pcbQualityIssue',
      enabled: true,
      tags: ['PCB设计', '硬件调试'],
    },
  ],
  softwareRules: [
    {
      id: 'sw-001',
      name: 'codeReviewRate',
      threshold: 90,
      operator: '<',
      level: 'warning',
      message: 'softwareQualityRisk',
      details: 'testCoverageLow',
      enabled: true,
      tags: ['软件架构', '测试开发'],
    },
    {
      id: 'sw-002',
      name: 'bugFixRate',
      threshold: 80,
      operator: '<',
      level: 'error',
      message: 'softwareQualityRisk',
      details: 'bugFixDelay',
      enabled: true,
      tags: ['驱动开发', '测试开发'],
    },
  ],
  projectRules: [
    {
      id: 'prj-001',
      name: 'milestoneDelay',
      threshold: 3,
      operator: '>',
      level: 'info',
      message: 'projectProgressRisk',
      details: 'milestoneDelay',
      enabled: true,
      tags: ['项目管理'],
    },
  ],
};

// 预警通知历史
const warningHistory: WarningNotification[] = [
  {
    id: 'wh-001',
    ruleId: 'hw-001',
    timestamp: '2025-05-19T10:00:00Z',
    message: 'hardwareDesignRisk',
    details: 'pcbDesignDelay',
    level: 'error',
    projectId: 'project1',
    notifiedUsers: ['user1', 'user2', 'user3'],
    status: 'pending',
  },
];

// 获取需要通知的用户
const getNotifiedUsers = (rule: WarningRule, projectId: string): string[] => {
  const users = new Set<string>();
  
  // 1. 添加项目成员
  if (projectMembers[projectId]) {
    projectMembers[projectId].forEach(user => users.add(user));
  }
  
  // 2. 添加具有相关标签的用户
  rule.tags.forEach(tag => {
    Object.entries(userTags).forEach(([userId, tags]) => {
      if (tags.includes(tag)) {
        users.add(userId);
      }
    });
  });
  
  return Array.from(users);
};

// 创建预警通知
const createWarningNotification = (rule: WarningRule, projectId: string): WarningNotification => {
  const notifiedUsers = getNotifiedUsers(rule, projectId);
  
  const notification: WarningNotification = {
    id: `wh-${Date.now()}`,
    ruleId: rule.id,
    timestamp: new Date().toISOString(),
    message: rule.message,
    details: rule.details,
    level: rule.level,
    projectId,
    notifiedUsers,
    status: 'pending',
  };
  
  warningHistory.push(notification);
  return notification;
};

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/json',
      'application/javascript',
      'text/javascript',
      'text/x-python',
      'text/x-java',
      'text/x-c++',
      'text/x-c',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/tasks', taskRoutes);

// 仪表盘数据
const mockData = {
  stats: {
    totalTasks: 24,
    resources: 156,
    teamMembers: 12,
    projects: 8,
  },
  hardwareKpis: [
    {
      title: 'schemeReviewRate',
      value: 85,
      target: 90,
      unit: '%',
      trend: 5,
      color: '#2196f3',
    },
    {
      title: 'pcbSuccessRate',
      value: 92,
      target: 95,
      unit: '%',
      trend: 3,
      color: '#4caf50',
    },
    {
      title: 'testCoverage',
      value: 88,
      target: 95,
      unit: '%',
      trend: -2,
      color: '#ff9800',
    },
  ],
  softwareKpis: [
    {
      title: 'codeReviewRate',
      value: 95,
      target: 100,
      unit: '%',
      trend: 2,
      color: '#2196f3',
    },
    {
      title: 'testCoverage',
      value: 82,
      target: 90,
      unit: '%',
      trend: 5,
      color: '#4caf50',
    },
    {
      title: 'bugFixRate',
      value: 78,
      target: 85,
      unit: '%',
      trend: -3,
      color: '#ff9800',
    },
  ],
  warnings: [
    {
      type: 'error',
      message: 'High CPU usage detected',
      details: 'Server CPU usage is above 90% for more than 5 minutes',
    },
    {
      type: 'warning',
      message: 'Low disk space',
      details: 'Server disk space is below 20%',
    },
    {
      type: 'info',
      message: 'New version available',
      details: 'Version 2.0.0 is ready for deployment',
    },
  ],
  taskCompletionData: [
    { name: '周一', completed: 5, total: 8 },
    { name: '周二', completed: 7, total: 10 },
    { name: '周三', completed: 6, total: 9 },
    { name: '周四', completed: 8, total: 12 },
    { name: '周五', completed: 4, total: 7 },
  ],
  resourceUsageData: [
    { name: 'CPU', value: 65 },
    { name: 'Memory', value: 45 },
    { name: 'Storage', value: 78 },
    { name: 'Network', value: 32 },
  ],
  teamActivityData: [
    { name: '周一', commits: 12, reviews: 8 },
    { name: '周二', commits: 15, reviews: 10 },
    { name: '周三', commits: 18, reviews: 12 },
    { name: '周四', commits: 14, reviews: 9 },
    { name: '周五', commits: 16, reviews: 11 },
  ],
};

// API 路由
app.get('/api/dashboard', (req, res) => {
  console.log('Received request for dashboard data');
  try {
    console.log('Sending mock data:', mockData);
    res.json(mockData);
  } catch (error) {
    console.error('Error sending dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取预警规则配置
app.get('/api/warning-rules', (req, res) => {
  console.log('Received request for warning rules');
  try {
    console.log('Sending warning rules:', warningRules);
    res.json(warningRules);
  } catch (error) {
    console.error('Error sending warning rules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 更新预警规则配置
app.put('/api/warning-rules/:id', (req, res) => {
  const { id } = req.params;
  const updatedRule = req.body;
  
  // 在实际应用中，这里需要更新数据库
  // 这里仅作为示例，返回更新后的规则
  res.json({
    ...updatedRule,
    id,
  });
});

// 获取预警通知历史
app.get('/api/warning-history', (req, res) => {
  res.json(warningHistory);
});

// 创建预警通知
app.post('/api/warning-notifications', (req, res) => {
  const { ruleId, projectId } = req.body;
  
  // 查找规则
  const rule = [...warningRules.hardwareRules, ...warningRules.softwareRules, ...warningRules.projectRules]
    .find(r => r.id === ruleId);
  
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  const notification = createWarningNotification(rule, projectId);
  res.json(notification);
});

// 更新预警通知状态
app.put('/api/warning-notifications/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const notification = warningHistory.find(n => n.id === id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  notification.status = status;
  res.json(notification);
});

// 仪表盘配置接口
app.get('/api/dashboard-config', (req, res) => {
  console.log('Received request for dashboard configuration');
  try {
    // 这里可以从数据库获取用户配置，暂时返回默认配置
    const defaultConfig = {
      components: [
        { id: 'totalTasks', title: 'totalTasks', type: 'stat', enabled: true, order: 0 },
        { id: 'resources', title: 'resources', type: 'stat', enabled: true, order: 1 },
        { id: 'teamMembers', title: 'teamMembers', type: 'stat', enabled: true, order: 2 },
        { id: 'projects', title: 'projects', type: 'stat', enabled: true, order: 3 },
        { id: 'hardwareKpis', title: 'hardwareDevelopmentKpis', type: 'kpi', enabled: true, order: 4 },
        { id: 'softwareKpis', title: 'softwareDevelopmentKpis', type: 'kpi', enabled: true, order: 5 },
        { id: 'taskCompletionTrend', title: 'taskCompletionTrend', type: 'chart', enabled: true, order: 6 },
        { id: 'resourceUsage', title: 'resourceUsage', type: 'chart', enabled: true, order: 7 },
        { id: 'teamActivity', title: 'teamActivity', type: 'chart', enabled: true, order: 8 },
      ]
    };
    res.json(defaultConfig);
  } catch (error) {
    console.error('Error sending dashboard configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/dashboard-config', (req, res) => {
  console.log('Received request to update dashboard configuration');
  try {
    const config = req.body;
    // 这里可以将配置保存到数据库
    console.log('Saving configuration:', config);
    res.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error saving dashboard configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 资源上传接口
app.post('/api/resources/upload', upload.single('file'), (req, res) => {
  console.log('Received resource upload request');
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, type } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 这里可以将资源信息保存到数据库
    const resource = {
      _id: Date.now().toString(),
      title,
      description,
      type,
      status: 'draft',
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      createdAt: new Date().toISOString(),
    };

    console.log('Resource uploaded:', resource);
    res.json(resource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取资源列表
app.get('/api/resources', (req, res) => {
  console.log('Received request for resources list');
  try {
    // 这里可以从数据库获取资源列表
    const resources = [
      {
        _id: '1',
        title: 'React Best Practices',
        description: 'A comprehensive guide to React development best practices',
        type: 'document',
        status: 'published',
        createdAt: '2024-03-15',
      },
      // ... 其他资源
    ];
    res.json(resources);
  } catch (error) {
    console.error('Error sending resources list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取资源详情
app.get('/api/resources/:id', (req, res) => {
  console.log('Received request for resource details');
  try {
    const { id } = req.params;
    // 这里可以从数据库获取资源详情
    const resource = {
      _id: id,
      title: 'React Best Practices',
      description: 'A comprehensive guide to React development best practices',
      type: 'document',
      status: 'published',
      createdAt: '2024-03-15',
    };
    res.json(resource);
  } catch (error) {
    console.error('Error sending resource details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 下载资源
app.get('/api/resources/:id/download', (req, res) => {
  console.log('Received request for resource download');
  try {
    const { id } = req.params;
    // 这里可以从数据库获取资源文件路径
    const filePath = path.join(__dirname, '../uploads', 'example.pdf');
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 任务进度 API
app.get('/api/task-list', (req, res) => {
  const filePath = path.join(__dirname, '../../TASK_LIST.md');
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 简单解析：只提取已完成任务、进行中任务、待开始任务
    const completed = Array.from(content.matchAll(/已完成任务[\s\S]*?\d+\. (.+?)（完成日期：(.+?)）/g)).map(m => ({ title: m[1], status: 'completed', endDate: m[2] }));
    const inProgress = Array.from(content.matchAll(/进行中任务[\s\S]*?\d+\. (.+?)\n\s+- 开始日期：(.+?)\n\s+- 预计完成日期：(.+?)\n\s+- 当前进度：(.+?)%/g)).map(m => ({ title: m[1], status: 'in-progress', startDate: m[2], endDate: m[3], progress: Number(m[4]) }));
    const pending = Array.from(content.matchAll(/待开始任务[\s\S]*?\d+\. (.+)/g)).map(m => ({ title: m[1], status: 'pending' }));
    res.json({ completed, inProgress, pending });
  } catch (e) {
    res.status(500).json({ error: '读取任务列表失败' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 