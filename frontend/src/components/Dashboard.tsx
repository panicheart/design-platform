import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // 示例数据
  const taskData = [
    { name: '周一', completed: 4, pending: 2 },
    { name: '周二', completed: 3, pending: 3 },
    { name: '周三', completed: 5, pending: 1 },
    { name: '周四', completed: 2, pending: 4 },
    { name: '周五', completed: 6, pending: 0 },
  ];

  const resourceData = [
    { name: '文档', value: 35 },
    { name: '代码', value: 25 },
    { name: '图片', value: 20 },
    { name: '其他', value: 20 },
  ];

  const activityData = [
    { name: '周一', commits: 12, reviews: 8 },
    { name: '周二', commits: 15, reviews: 10 },
    { name: '周三', commits: 8, reviews: 12 },
    { name: '周四', commits: 20, reviews: 15 },
    { name: '周五', commits: 18, reviews: 9 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* 任务进度入口 */}
        <Box
          sx={{
            width: '100%',
            p: 1
          }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">任务进度追踪</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/tasks')}
                >
                  查看详情
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 任务完成趋势 */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            p: 1
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                任务完成趋势
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="已完成" fill="#8884d8" />
                    <Bar dataKey="pending" name="待处理" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 资源使用分布 */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            p: 1
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                资源使用分布
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 团队活跃度 */}
        <Box
          sx={{
            width: '100%',
            p: 1
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                团队活跃度
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commits" name="代码提交" stroke="#8884d8" />
                    <Line type="monotone" dataKey="reviews" name="代码审查" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard; 