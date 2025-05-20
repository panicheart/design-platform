import React from 'react';
import { Box, Typography } from '@mui/material';

const ResourceLibrary: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        资源库
      </Typography>
      <Typography variant="body1">
        资源库功能开发中...
      </Typography>
    </Box>
  );
};

export default ResourceLibrary; 