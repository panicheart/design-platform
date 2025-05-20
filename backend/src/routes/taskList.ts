import express from 'express';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const router = express.Router();

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  endDate: string;
  progress?: number;
  description?: string;
}

// 解析任务列表
function parseTaskList(content: string): Task[] {
  const tasks: Task[] = [];
  const lines = content.split('\n');
  let currentTask: Partial<Task> = {};
  let taskId = 1;

  for (const line of lines) {
    // 匹配任务标题
    if (line.startsWith('- [x]') || line.startsWith('- [ ]')) {
      const title = line.replace(/^-\s*\[[ x]\]\s*/, '').trim();
      if (title) {
        if (Object.keys(currentTask).length > 0) {
          tasks.push(currentTask as Task);
        }
        currentTask = {
          id: String(taskId++),
          title,
          status: line.includes('[x]') ? 'completed' : 'pending',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        };
      }
    }
    // 匹配任务描述
    else if (line.trim().startsWith('- 备注：')) {
      currentTask.description = line.replace('- 备注：', '').trim();
    }
    // 匹配任务进度
    else if (line.includes('当前进度：')) {
      const progressMatch = line.match(/当前进度：(\d+)%/);
      if (progressMatch) {
        currentTask.progress = parseInt(progressMatch[1]);
        currentTask.status = 'in-progress';
      }
    }
  }

  // 添加最后一个任务
  if (Object.keys(currentTask).length > 0) {
    tasks.push(currentTask as Task);
  }

  return tasks;
}

// 获取任务列表
router.get('/api/task-list', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../../TASK_LIST.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    const tasks = parseTaskList(content);
    res.json({ tasks });
  } catch (error) {
    console.error('Error reading task list:', error);
    res.status(500).json({ error: 'Failed to read task list' });
  }
});

export default router; 