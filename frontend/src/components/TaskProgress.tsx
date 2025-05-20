import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Schedule, Pending } from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  endDate: string;
  progress?: number;
  description?: string;
}

const TaskProgress: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/task-list');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'in-progress':
        return <Schedule />;
      case 'pending':
        return <Pending />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        任务进度追踪
      </Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Box
            key={task.id}
            sx={{
              width: { xs: '100%', md: '50%' },
              p: 1
            }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip
                    icon={getStatusIcon(task.status) || undefined}
                    label={task.status === 'in-progress' ? '进行中' : task.status === 'completed' ? '已完成' : '待开始'}
                    color={getStatusColor(task.status) as 'success' | 'primary' | 'warning' | 'default'}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  开始日期: {task.startDate} | 预计完成: {task.endDate}
                </Typography>
                {task.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>
                )}
                {task.status === 'in-progress' && task.progress !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      完成进度: {task.progress}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskProgress; 