"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  InputAdornment,
  Box
} from '@mui/material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';

interface StatsDialogProps {
  open: boolean;
  onClose: () => void;
  stats: any;
  onSave: () => void;
  locale: string;
}

export default function StatsDialog({ open, onClose, stats, onSave, locale }: StatsDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    label: '',
    labelEn: '',
    description: '',
    descriptionEn: '',
    category: 'general',
    type: 'number',
    unit: '',
    unitEn: '',
    icon: '',
    color: '',
    order: 0,
    visible: true,
    locale: locale as 'fa' | 'en',
    createdBy: 'admin',
    updatedBy: 'admin'
  });

  const [, createStats] = useAxios({ method: 'POST' }, { manual: true });
  const [, updateStats] = useAxios({ method: 'PATCH' }, { manual: true });

  useEffect(() => {
    if (stats) {
      setFormData({
        key: stats.key || '',
        value: stats.value?.toString() || '',
        label: stats.label || '',
        labelEn: stats.labelEn || '',
        description: stats.description || '',
        descriptionEn: stats.descriptionEn || '',
        category: stats.category || 'general',
        type: stats.type || 'number',
        unit: stats.unit || '',
        unitEn: stats.unitEn || '',
        icon: stats.icon || '',
        color: stats.color || '',
        order: stats.order || 0,
        visible: stats.visible !== undefined ? stats.visible : true,
        locale: stats.locale || locale as 'fa' | 'en',
        createdBy: stats.createdBy || 'admin',
        updatedBy: 'admin'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        key: '',
        value: '',
        label: '',
        labelEn: '',
        description: '',
        descriptionEn: '',
        category: 'general',
        type: 'number',
        unit: '',
        unitEn: '',
        icon: '',
        color: '',
        order: 0,
        visible: true,
        locale: locale as 'fa' | 'en',
        createdBy: 'admin',
        updatedBy: 'admin'
      }));
    }
  }, [stats, locale]);

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        value: formData.type === 'number' ? parseFloat(formData.value) || 0 : formData.value,
        order: parseInt(formData.order.toString()) || 0
      };

      if (stats) {
        await updateStats({ url: `/api/stats/${stats.id}`, data: submitData });
      } else {
        await createStats({ url: '/api/stats', data: submitData });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const isRTL = locale === 'fa';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {stats ? 
          (isRTL ? 'ویرایش آمار' : 'Edit Stats') : 
          (isRTL ? 'افزودن آمار جدید' : 'Add New Stats')
        }
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label={isRTL ? 'کلید' : 'Key'}
            value={formData.key}
            onChange={handleChange('key')}
            required
            helperText={isRTL ? 'شناسه یکتا برای آمار' : 'Unique identifier for the stat'}
          />
            <TextField
              fullWidth
              label={isRTL ? 'مقدار' : 'Value'}
              value={formData.value}
              onChange={handleChange('value')}
              required
              type={formData.type === 'number' ? 'number' : 'text'}
            />
          
            <TextField
              fullWidth
              label={isRTL ? 'برچسب (فارسی)' : 'Label (Persian)'}
              value={formData.label}
              onChange={handleChange('label')}
              required
            />
            <TextField
              fullWidth
              label={isRTL ? 'برچسب (انگلیسی)' : 'Label (English)'}
              value={formData.labelEn}
              onChange={handleChange('labelEn')}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label={isRTL ? 'توضیحات (فارسی)' : 'Description (Persian)'}
              value={formData.description}
              onChange={handleChange('description')}
            />
          
            <TextField
              fullWidth
              multiline
              rows={2}
              label={isRTL ? 'توضیحات (انگلیسی)' : 'Description (English)'}
              value={formData.descriptionEn}
              onChange={handleChange('descriptionEn')}
            />

            <FormControl fullWidth>
              <InputLabel>{isRTL ? 'دسته‌بندی' : 'Category'}</InputLabel>
              <Select value={formData.category} onChange={handleChange('category')}>
                <MenuItem value="members">{isRTL ? 'اعضا' : 'Members'}</MenuItem>
                <MenuItem value="projects">{isRTL ? 'پروژه‌ها' : 'Projects'}</MenuItem>
                <MenuItem value="publications">{isRTL ? 'انتشارات' : 'Publications'}</MenuItem>
                <MenuItem value="events">{isRTL ? 'رویدادها' : 'Events'}</MenuItem>
                <MenuItem value="achievements">{isRTL ? 'دستاوردها' : 'Achievements'}</MenuItem>
                <MenuItem value="general">{isRTL ? 'عمومی' : 'General'}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{isRTL ? 'نوع' : 'Type'}</InputLabel>
              <Select value={formData.type} onChange={handleChange('type')}>
                <MenuItem value="number">{isRTL ? 'عدد' : 'Number'}</MenuItem>
                <MenuItem value="text">{isRTL ? 'متن' : 'Text'}</MenuItem>
                <MenuItem value="percentage">{isRTL ? 'درصد' : 'Percentage'}</MenuItem>
                <MenuItem value="currency">{isRTL ? 'ارز' : 'Currency'}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={isRTL ? 'واحد (فارسی)' : 'Unit (Persian)'}
              value={formData.unit}
              onChange={handleChange('unit')}
              placeholder={isRTL ? 'مثال: نفر، پروژه، مقاله' : 'e.g., people, projects, articles'}
            />

            <TextField
              fullWidth
              label={isRTL ? 'واحد (انگلیسی)' : 'Unit (English)'}
              value={formData.unitEn}
              onChange={handleChange('unitEn')}
              placeholder={isRTL ? 'e.g., people, projects, articles' : 'e.g., people, projects, articles'}
            />

            <TextField
              fullWidth
              label={isRTL ? 'آیکون' : 'Icon'}
              value={formData.icon}
              onChange={handleChange('icon')}
              placeholder={isRTL ? 'نام آیکون Material-UI' : 'Material-UI icon name'}
              InputProps={{
                startAdornment: <InputAdornment position="start">@mui/icons-material/</InputAdornment>
              }}
            />

            <TextField
              fullWidth
              label={isRTL ? 'رنگ' : 'Color'}
              value={formData.color}
              onChange={handleChange('color')}
              placeholder={isRTL ? 'مثال: #1976d2 یا primary' : 'e.g., #1976d2 or primary'}
            />

            <TextField
              fullWidth
              type="number"
              label={isRTL ? 'ترتیب نمایش' : 'Display Order'}
              value={formData.order}
              onChange={handleChange('order')}
              inputProps={{ min: 0 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.visible}
                  onChange={handleChange('visible')}
                />
              }
              label={isRTL ? 'نمایش در سایت' : 'Visible on Website'}
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
              {isRTL ? 'پیش‌نمایش:' : 'Preview:'}
            </Typography>
            <Box sx={{ 
              p: 2, 
              border: '1px dashed', 
              borderColor: 'divider', 
              borderRadius: 1,
              textAlign: 'center',
              backgroundColor: 'background.paper'
            }}>
              <Typography variant="h4" fontWeight={700} color={formData.color || 'primary.main'}>
                {formData.value}
                {formData.unit && (
                  <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
                    {formData.unit}
                  </Typography>
                )}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {formData.label}
              </Typography>
            </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {isRTL ? 'انصراف' : 'Cancel'}
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {isRTL ? 'ذخیره' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
