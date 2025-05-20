import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';

import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Assignment as TaskIcon,
  BugReport as BugIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  Science as ScienceIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';

import { useLanguage } from '../../contexts/LanguageContext';
import { taskAPI } from '../../services/api';
import type { RootState } from '../../store';
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
} from '../../store/slices/taskSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const DevelopmentPlatform: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { t } = useLanguage();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await taskAPI.getTasks();
        dispatch(fetchTasksSuccess(response.data.data));
      } catch (error) {
        dispatch(fetchTasksFailure('Failed to fetch tasks'));
      }
    };

    loadTasks();
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'new_product':
        return <BuildIcon />;
      case 'model_development':
        return <ScienceIcon />;
      case 'circuit_verification':
        return <CodeIcon />;
      case 'issue_handling':
        return <BugIcon />;
      case 'testing':
        return <TaskIcon />;
      case 'technical_cooperation':
        return <HandshakeIcon />;
      default:
        return <TaskIcon />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    return t(type);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            {t('developmentPlatform.title')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            {t('developmentPlatform.createTask')}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {task.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {t('developmentPlatform.status')}: {task.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('developmentPlatform.priority')}: {task.priority}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default DevelopmentPlatform; 