import React from 'react';
import { Box, Typography } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        个人中心
      </Typography>
      <Typography variant="body1">
        个人中心功能开发中...
      </Typography>
    </Box>
  );
};

export default Profile; 