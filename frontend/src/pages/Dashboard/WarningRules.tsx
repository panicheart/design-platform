import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';

interface WarningRule {
  id: string;
  name: string;
  threshold: number;
  operator: '<' | '>' | '=' | '<=';
  level: 'error' | 'warning' | 'info';
  message: string;
  details: string;
  enabled: boolean;
  tags: string[];
}

interface WarningRulesData {
  hardwareRules: WarningRule[];
  softwareRules: WarningRule[];
  projectRules: WarningRule[];
}

const WarningRules: React.FC = () => {
  const { t } = useLanguage();
  const [rules, setRules] = useState<WarningRulesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [currentRule, setCurrentRule] = useState<WarningRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/warning-rules');
      if (!response.ok) {
        throw new Error('Failed to fetch warning rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: WarningRule) => {
    setCurrentRule(rule);
    setEditDialog(true);
  };

  const handleSave = async () => {
    if (!currentRule) return;

    try {
      const response = await fetch(`http://localhost:5001/api/warning-rules/${currentRule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRule),
      });

      if (!response.ok) {
        throw new Error('Failed to update warning rule');
      }

      await fetchRules();
      setEditDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleToggle = async (rule: WarningRule) => {
    try {
      const updatedRule = { ...rule, enabled: !rule.enabled };
      const response = await fetch(`http://localhost:5001/api/warning-rules/${rule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRule),
      });

      if (!response.ok) {
        throw new Error('Failed to update warning rule');
      }

      await fetchRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!rules) {
    return null;
  }

  const renderRulesTable = (rules: WarningRule[], title: string) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t(title)}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('ruleName')}</TableCell>
              <TableCell>{t('threshold')}</TableCell>
              <TableCell>{t('operator')}</TableCell>
              <TableCell>{t('level')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{t(rule.name)}</TableCell>
                <TableCell>{rule.threshold}</TableCell>
                <TableCell>{rule.operator}</TableCell>
                <TableCell>{t(rule.level)}</TableCell>
                <TableCell>
                  <Switch
                    checked={rule.enabled}
                    onChange={() => handleToggle(rule)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(rule)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('warningRules')}
      </Typography>

      {renderRulesTable(rules.hardwareRules, 'hardwareRules')}
      {renderRulesTable(rules.softwareRules, 'softwareRules')}
      {renderRulesTable(rules.projectRules, 'projectRules')}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>{t('editRule')}</DialogTitle>
        <DialogContent>
          {currentRule && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('threshold')}
                type="number"
                id="threshold"
                name="threshold"
                value={currentRule.threshold}
                onChange={(e) => setCurrentRule({ ...currentRule, threshold: Number(e.target.value) })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="operator-label">{t('operator')}</InputLabel>
                <Select
                  labelId="operator-label"
                  id="operator"
                  name="operator"
                  value={currentRule.operator}
                  onChange={(e) => setCurrentRule({ ...currentRule, operator: e.target.value as WarningRule['operator'] })}
                >
                  <MenuItem value="<">{'<'}</MenuItem>
                  <MenuItem value=">">{'>'}</MenuItem>
                  <MenuItem value="=">{'='}</MenuItem>
                  <MenuItem value="<=">{'<='}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="level-label">{t('level')}</InputLabel>
                <Select
                  labelId="level-label"
                  id="level"
                  name="level"
                  value={currentRule.level}
                  onChange={(e) => setCurrentRule({ ...currentRule, level: e.target.value as WarningRule['level'] })}
                >
                  <MenuItem value="error">{t('error')}</MenuItem>
                  <MenuItem value="warning">{t('warning')}</MenuItem>
                  <MenuItem value="info">{t('info')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>{t('cancel')}</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarningRules; 