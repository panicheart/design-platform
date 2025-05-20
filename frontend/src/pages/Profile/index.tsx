import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface User {
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  position: string;
  skills: string[];
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    department: 'Research & Development',
    position: 'Senior Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
  });

  const [editedUser, setEditedUser] = useState<User>(user);

  const handleInputChange = (field: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({
      ...editedUser,
      [field]: event.target.value,
    });
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('profile')}
        </Typography>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              {t('save')}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              {t('cancel')}
            </Button>
          </Box>
        ) : (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            {t('edit')}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={editedUser.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                  size="small"
                />
              ) : (
                user.name
              )}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.position}
            </Typography>
            <Typography color="text.secondary">
              {user.department}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('contactInformation')}
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('email')}
                  secondary={
                    isEditing ? (
                      <TextField
                        fullWidth
                        value={editedUser.email}
                        onChange={handleInputChange('email')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      user.email
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('phone')}
                  secondary={
                    isEditing ? (
                      <TextField
                        fullWidth
                        value={editedUser.phone}
                        onChange={handleInputChange('phone')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      user.phone
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('location')}
                  secondary={
                    isEditing ? (
                      <TextField
                        fullWidth
                        value={editedUser.location}
                        onChange={handleInputChange('location')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      user.location
                    )
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              {t('professionalInformation')}
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('department')}
                  secondary={
                    isEditing ? (
                      <TextField
                        fullWidth
                        value={editedUser.department}
                        onChange={handleInputChange('department')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      user.department
                    )
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('position')}
                  secondary={
                    isEditing ? (
                      <TextField
                        fullWidth
                        value={editedUser.position}
                        onChange={handleInputChange('position')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      user.position
                    )
                  }
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              {t('skills')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {user.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile; 