import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as ResolvedIcon,
  AccessTime as PendingIcon,
  Build as ProcessingIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

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

const WarningNotifications: React.FC = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<WarningNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<WarningNotification | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/warning-history');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (notification: WarningNotification, newStatus: WarningNotification['status']) => {
    try {
      const response = await fetch(`http://localhost:5001/api/warning-notifications/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification status');
      }

      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusIcon = (status: WarningNotification['status']) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'processing':
        return <ProcessingIcon color="info" />;
      case 'resolved':
        return <ResolvedIcon color="success" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getLevelIcon = (level: WarningNotification['level']) => {
    switch (level) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('warningNotifications')}
      </Typography>

      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            component={Paper}
            sx={{ mb: 2, p: 2 }}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                {notification.status === 'pending' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleStatusChange(notification, 'processing')}
                  >
                    {t('startProcessing')}
                  </Button>
                )}
                {notification.status === 'processing' && (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleStatusChange(notification, 'resolved')}
                  >
                    {t('markAsResolved')}
                  </Button>
                )}
              </Stack>
            }
          >
            <ListItemIcon>
              {getLevelIcon(notification.level)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">
                    {t(notification.message)}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(notification.status)}
                    label={t(notification.status)}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {t(notification.details)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getLevelIcon(selectedNotification.level)}
                {t(selectedNotification.message)}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {t(selectedNotification.details)}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {t('notifiedUsers')}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedNotification.notifiedUsers.map((userId) => (
                  <Chip key={userId} label={userId} size="small" />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedNotification(null)}>
                {t('close')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WarningNotifications; 