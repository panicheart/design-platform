import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import ResourceUpload from './ResourceUpload';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
}

const ResourceLibrary: React.FC = () => {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newResource: Resource) => {
    setResources([newResource, ...resources]);
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/resources/${id}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resource'; // 文件名可以从响应头中获取
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setResources(resources.filter(resource => resource._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {t('resourceLibrary')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          {t('uploadResource')}
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          placeholder={t('searchResources')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('type')}</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label={t('type')}
          >
            <MenuItem value="all">{t('allTypes')}</MenuItem>
            <MenuItem value="document">{t('document')}</MenuItem>
            <MenuItem value="code">{t('code')}</MenuItem>
            <MenuItem value="tool">{t('tool')}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {filteredResources.map((resource) => (
          <Card key={resource._id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {resource.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {resource.description}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <Chip
                  label={t(resource.type)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={t(resource.status)}
                  size="small"
                  color={resource.status === 'published' ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Stack>
            </CardContent>
            <CardActions>
              <IconButton
                onClick={() => handleDownload(resource._id)}
                title={t('download')}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                onClick={() => {/* TODO: 实现编辑功能 */}}
                title={t('edit')}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(resource._id)}
                title={t('delete')}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* <ResourceUpload open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} onUpload={handleUpload} /> */}
      <ResourceUpload />
    </Box>
  );
};

export default ResourceLibrary; 