import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardComponent {
  id: string;
  title: string;
  type: 'stat' | 'kpi' | 'chart';
  enabled: boolean;
  order: number;
}

interface DashboardConfig {
  components: DashboardComponent[];
}

const defaultComponents: DashboardComponent[] = [
  { id: 'totalTasks', title: 'totalTasks', type: 'stat', enabled: true, order: 0 },
  { id: 'resources', title: 'resources', type: 'stat', enabled: true, order: 1 },
  { id: 'teamMembers', title: 'teamMembers', type: 'stat', enabled: true, order: 2 },
  { id: 'projects', title: 'projects', type: 'stat', enabled: true, order: 3 },
  { id: 'hardwareKpis', title: 'hardwareDevelopmentKpis', type: 'kpi', enabled: true, order: 4 },
  { id: 'softwareKpis', title: 'softwareDevelopmentKpis', type: 'kpi', enabled: true, order: 5 },
  { id: 'taskCompletionTrend', title: 'taskCompletionTrend', type: 'chart', enabled: true, order: 6 },
  { id: 'resourceUsage', title: 'resourceUsage', type: 'chart', enabled: true, order: 7 },
  { id: 'teamActivity', title: 'teamActivity', type: 'chart', enabled: true, order: 8 },
];

const DashboardConfig: React.FC = () => {
  const { t } = useLanguage();
  const [config, setConfig] = useState<DashboardConfig>({ components: defaultComponents });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

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
      // If there's an error, use default config
      setConfig({ components: defaultComponents });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (componentId: string) => {
    const updatedComponents = config.components.map(comp =>
      comp.id === componentId ? { ...comp, enabled: !comp.enabled } : comp
    );
    setConfig({ ...config, components: updatedComponents });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const components = Array.from(config.components);
    const [reorderedItem] = components.splice(result.source.index, 1);
    components.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedComponents = components.map((comp, index) => ({
      ...comp,
      order: index,
    }));

    setConfig({ ...config, components: updatedComponents });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/dashboard-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to save dashboard configuration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {t('dashboardConfiguration')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          {t('saveConfiguration')}
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('dragToReorder')}
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="components">
            {(provided: DroppableProvided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {config.components.map((component, index) => (
                  <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <DragIcon sx={{ mr: 2 }} />
                        <ListItemText
                          primary={t(component.title)}
                          secondary={t(component.type)}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            edge="end"
                            checked={component.enabled}
                            onChange={() => handleToggle(component.id)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Box>
  );
};

export default DashboardConfig; 