import React from 'react';
import { Box, Typography } from '@mui/material';

const DevelopmentPlatform: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        开发平台
      </Typography>
      <Typography variant="body1">
        开发平台功能开发中...
      </Typography>
    </Box>
  );
};

export default DevelopmentPlatform; 