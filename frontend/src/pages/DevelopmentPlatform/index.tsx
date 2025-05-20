import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { taskAPI } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(fetchTasksStart());
      try {
        const response = await taskAPI.getAll();
        dispatch(fetchTasksSuccess(response.data));
      } catch (error) {
        dispatch(fetchTasksFailure('Failed to fetch tasks'));
      }
    };

    fetchTasks();
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('developmentPlatform')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement new task creation */}}
        >
          {t('newTask')}
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t('allTasks')} />
          <Tab label={t('newProduct')} />
          <Tab label={t('modelDevelopment')} />
          <Tab label={t('circuitVerification')} />
          <Tab label={t('issueHandling')} />
          <Tab label={t('testing')} />
          <Tab label={t('technicalCooperation')} />
        </Tabs>

        {loading ? (
          <LinearProgress />
        ) : (
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              {tasks.map((task) => (
                <Box key={task._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTaskIcon(task.type)}
                          <Typography variant="h6" component="div">
                            {task.title}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, task._id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {task.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={getTaskTypeLabel(task.type)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={t(`status.${task.status}`)}
                          size="small"
                          color={
                            task.status === 'completed'
                              ? 'success'
                              : task.status === 'in-progress'
                              ? 'primary'
                              : 'default'
                          }
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('progress')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {task.progress}%
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small">{t('viewDetails')}</Button>
                      <Button size="small">{t('updateProgress')}</Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          </TabPanel>
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>{t('edit')}</MenuItem>
        <MenuItem onClick={handleMenuClose}>{t('assign')}</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          {t('delete')}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DevelopmentPlatform; 