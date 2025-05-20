import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('dashboard')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('recentActivities')}
            </Typography>
            {/* TODO: Add recent activities list */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('quickStats')}
            </Typography>
            {/* TODO: Add quick stats */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('upcomingTasks')}
            </Typography>
            {/* TODO: Add upcoming tasks list */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 