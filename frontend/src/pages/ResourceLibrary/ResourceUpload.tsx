import React, { useState } from 'react';
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
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface ResourceUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (resource: any) => void;
}

const ResourceUpload: React.FC<ResourceUploadProps> = ({ open, onClose, onUpload }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // 创建预览 URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !title || !type) {
      setError(t('pleaseFillRequiredFields'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);

      const response = await fetch('http://localhost:5001/api/resources/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUpload(result);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setType('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('uploadResource')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={3}>
            {/* 文件上传区域 */}
            <Paper
              sx={{
                p: 3,
                border: '2px dashed #ccc',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              {!file ? (
                <Box>
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('dragAndDropFile')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('orClickToSelect')}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {file.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
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
            </Paper>

            {/* 基本信息表单 */}
            <TextField
              label={t('title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label={t('description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>{t('type')}</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label={t('type')}
              >
                <MenuItem value="document">{t('document')}</MenuItem>
                <MenuItem value="code">{t('code')}</MenuItem>
                <MenuItem value="tool">{t('tool')}</MenuItem>
              </Select>
            </FormControl>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? t('uploading') : t('upload')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceUpload; 