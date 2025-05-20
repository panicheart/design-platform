import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addResource } from '../../store/slices/resourceSlice';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface UploadFormData {
  name: string;
  description: string;
  type: string;
  file: File | null;
}

const ResourceUpload: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
    description: '',
    type: '',
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      console.error('No file selected');
      return;
    }
    try {
      const resourceData = {
        id: Date.now().toString(), // 临时 ID，实际应该由后端生成
        title: formData.name,
        type: formData.type,
        status: 'draft',
        description: formData.description,
        url: '', // 临时空值，实际应该由后端生成
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await dispatch(addResource(resourceData));
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: '',
        file: null,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0],
      }));
      // 创建预览 URL
      const url = URL.createObjectURL(e.target.files![0]);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
    }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('uploadResource')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label={t('title')}
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label={t('description')}
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">{t('type')}</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formData.type}
            label={t('type')}
            onChange={handleSelectChange}
          >
            <MenuItem value="document">{t('document')}</MenuItem>
            <MenuItem value="image">{t('image')}</MenuItem>
            <MenuItem value="code">{t('code')}</MenuItem>
            <MenuItem value="other">{t('other')}</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          {t('chooseFile')}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {formData.file && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {formData.file.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <IconButton onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}>
                <DeleteIcon />
              </IconButton>
              {previewUrl && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(previewUrl, '_blank');
                  }}
                >
                  <PreviewIcon />
                </IconButton>
              )}
            </Stack>
          </Box>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          {loading ? t('uploading') : t('upload')}
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceUpload; 