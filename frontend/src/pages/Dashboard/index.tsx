import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Alert,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  LibraryBooks as ResourceIcon,
  Group as TeamIcon,
  Work as ProjectIcon,
  Hardware as HardwareIcon,
  Code as CodeIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import WarningRules from './WarningRules';
import WarningNotifications from './WarningNotifications';
import DashboardConfig from './DashboardConfig';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: string;
}

interface KpiCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

interface DashboardData {
  stats: {
    totalTasks: number;
    resources: number;
    teamMembers: number;
    projects: number;
  };
  hardwareKpis: Array<{
    title: string;
    value: number;
    target: number;
    unit: string;
    trend: number;
    color: string;
  }>;
  softwareKpis: Array<{
    title: string;
    value: number;
    target: number;
    unit: string;
    trend: number;
    color: string;
  }>;
  warnings: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    details: string;
  }>;
  taskCompletionData: Array<{
    name: string;
    completed: number;
    total: number;
  }>;
  resourceUsageData: Array<{
    name: string;
    value: number;
  }>;
  teamActivityData: Array<{
    name: string;
    commits: number;
    reviews: number;
  }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, link, icon, color }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography color="textSecondary" gutterBottom>
            {t(title)}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t(description)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(link)}>
          {t('viewDetails')}
        </Button>
      </CardActions>
    </Card>
  );
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, target, unit, trend, icon, color }) => {
  const { t } = useLanguage();
  const trendColor = trend >= 0 ? '#4caf50' : '#f44336';

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography color="textSecondary">
            {t(title)}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}{unit}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="textSecondary">
            {t('target')}: {target}{unit}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: trendColor }}>
              {trend >= 0 ? '+' : ''}{trend}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('vsLastPeriod')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWarningRules, setShowWarningRules] = useState(false);
  const [showWarningNotifications, setShowWarningNotifications] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching dashboard data...');
      try {
        const response = await fetch('http://localhost:5001/api/dashboard');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}\n${errorText}`);
        }
        
        const jsonData = await response.json();
        console.log('Received data:', jsonData);
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/dashboard-config');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard configuration');
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Error fetching dashboard config:', err);
      }
    };

    fetchData();
    fetchConfig();
  }, []);

  if (loading) {
    console.log('Dashboard is loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    console.log('No data available');
    return null;
  }

  console.log('Rendering dashboard with data:', data);
  
  const stats = [
    {
      title: 'totalTasks',
      value: data.stats.totalTasks,
      description: 'activeDevelopmentTasks',
      link: '/development-platform',
      icon: <TaskIcon sx={{ color: '#2196f3' }} />,
      color: '#2196f3',
    },
    {
      title: 'resources',
      value: data.stats.resources,
      description: 'availableResources',
      link: '/resources',
      icon: <ResourceIcon sx={{ color: '#4caf50' }} />,
      color: '#4caf50',
    },
    {
      title: 'teamMembers',
      value: data.stats.teamMembers,
      description: 'activeTeamMembers',
      link: '/team',
      icon: <TeamIcon sx={{ color: '#ff9800' }} />,
      color: '#ff9800',
    },
    {
      title: 'projects',
      value: data.stats.projects,
      description: 'ongoingProjects',
      link: '/projects',
      icon: <ProjectIcon sx={{ color: '#9c27b0' }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {/* 统计卡片 */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {t('totalTasks')}
              </Typography>
            </Box>
            <Typography variant="h4">150</Typography>
            <Typography color="text.secondary" variant="body2">
              +12% {t('fromLastMonth')}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {t('activeUsers')}
              </Typography>
            </Box>
            <Typography variant="h4">45</Typography>
            <Typography color="text.secondary" variant="body2">
              +8% {t('fromLastMonth')}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                {t('storageUsed')}
              </Typography>
            </Box>
            <Typography variant="h4">75%</Typography>
            <Typography color="text.secondary" variant="body2">
              {t('ofTotalStorage')}
            </Typography>
          </CardContent>
        </Card>

        {/* 图表 */}
        <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('taskTrend')}</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke={theme.palette.primary.main} name={t('completedTasks')} />
                <Line type="monotone" dataKey="total" stroke="#4caf50" name={t('totalTasksChart')} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('resourceDistribution')}</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.resourceUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.resourceUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      <Dialog
        open={showConfig}
        onClose={() => setShowConfig(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DashboardConfig />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfig(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showWarningRules}
        onClose={() => setShowWarningRules(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <WarningRules />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarningRules(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showWarningNotifications}
        onClose={() => setShowWarningNotifications(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <WarningNotifications />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarningNotifications(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 