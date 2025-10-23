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
  Grid,
  Stack,
  Chip,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { faIR } from 'date-fns/locale';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  event: any;
  onSave: () => void;
  locale: string;
}

export default function EventDialog({ open, onClose, event, onSave, locale }: EventDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: new Date(),
    time: '',
    location: '',
    locationEn: '',
    type: 'workshop',
    category: 'academic',
    status: 'draft',
    maxParticipants: '',
    registrationRequired: false,
    registrationDeadline: null as Date | null,
    contactEmail: '',
    contactPhone: '',
    imageUrl: '',
    tags: [] as string[],
    contentHtml: '',
    contentHtmlEn: '',
    locale: locale as 'fa' | 'en',
    createdBy: 'admin',
    updatedBy: 'admin'
  });

  const [tagInput, setTagInput] = useState('');

  const [, createEvent] = useAxios({ method: 'POST' }, { manual: true });
  const [, updateEvent] = useAxios({ method: 'PATCH' }, { manual: true });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        titleEn: event.titleEn || '',
        description: event.description || '',
        descriptionEn: event.descriptionEn || '',
        date: event.date ? new Date(event.date) : new Date(),
        time: event.time || '',
        location: event.location || '',
        locationEn: event.locationEn || '',
        type: event.type || 'workshop',
        category: event.category || 'academic',
        status: event.status || 'draft',
        maxParticipants: event.maxParticipants?.toString() || '',
        registrationRequired: event.registrationRequired || false,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : null,
        contactEmail: event.contactEmail || '',
        contactPhone: event.contactPhone || '',
        imageUrl: event.imageUrl || '',
        tags: event.tags || [],
        contentHtml: event.contentHtml || '',
        contentHtmlEn: event.contentHtmlEn || '',
        locale: event.locale || locale as 'fa' | 'en',
        createdBy: event.createdBy || 'admin',
        updatedBy: 'admin'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        date: new Date(),
        time: '',
        location: '',
        locationEn: '',
        type: 'workshop',
        category: 'academic',
        status: 'draft',
        maxParticipants: '',
        registrationRequired: false,
        registrationDeadline: null,
        contactEmail: '',
        contactPhone: '',
        imageUrl: '',
        tags: [],
        contentHtml: '',
        contentHtmlEn: '',
        locale: locale as 'fa' | 'en',
        createdBy: 'admin',
        updatedBy: 'admin'
      }));
    }
  }, [event, locale]);

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      const timeString = time.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setFormData(prev => ({ ...prev, time: timeString }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        registrationDeadline: formData.registrationDeadline?.toISOString(),
        date: formData.date.toISOString()
      };

      if (event) {
        await updateEvent({ url: `/api/events/${event.id}`, data: submitData });
      } else {
        await createEvent({ url: '/api/events', data: submitData });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const isRTL = locale === 'fa';

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={isRTL ? faIR : undefined}
    >
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {event ? 
            (isRTL ? 'ویرایش رویداد' : 'Edit Event') : 
            (isRTL ? 'افزودن رویداد جدید' : 'Add New Event')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isRTL ? 'عنوان (فارسی)' : 'Title (Persian)'}
                value={formData.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isRTL ? 'عنوان (انگلیسی)' : 'Title (English)'}
                value={formData.titleEn}
                onChange={handleChange('titleEn')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={isRTL ? 'توضیحات (فارسی)' : 'Description (Persian)'}
                value={formData.description}
                onChange={handleChange('description')}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={isRTL ? 'توضیحات (انگلیسی)' : 'Description (English)'}
                value={formData.descriptionEn}
                onChange={handleChange('descriptionEn')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label={isRTL ? 'تاریخ' : 'Date'}
                value={formData.date}
                onChange={handleDateChange('date')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TimePicker
                label={isRTL ? 'زمان' : 'Time'}
                value={formData.time ? new Date(`2000-01-01T${formData.time}`) : null}
                onChange={handleTimeChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isRTL ? 'مکان (فارسی)' : 'Location (Persian)'}
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isRTL ? 'مکان (انگلیسی)' : 'Location (English)'}
                value={formData.locationEn}
                onChange={handleChange('locationEn')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{isRTL ? 'نوع' : 'Type'}</InputLabel>
                <Select value={formData.type} onChange={handleChange('type')}>
                  <MenuItem value="workshop">{isRTL ? 'کارگاه' : 'Workshop'}</MenuItem>
                  <MenuItem value="seminar">{isRTL ? 'سمینار' : 'Seminar'}</MenuItem>
                  <MenuItem value="conference">{isRTL ? 'کنفرانس' : 'Conference'}</MenuItem>
                  <MenuItem value="contest">{isRTL ? 'مسابقه' : 'Contest'}</MenuItem>
                  <MenuItem value="meeting">{isRTL ? 'جلسه' : 'Meeting'}</MenuItem>
                  <MenuItem value="other">{isRTL ? 'سایر' : 'Other'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{isRTL ? 'دسته‌بندی' : 'Category'}</InputLabel>
                <Select value={formData.category} onChange={handleChange('category')}>
                  <MenuItem value="academic">{isRTL ? 'آکادمیک' : 'Academic'}</MenuItem>
                  <MenuItem value="research">{isRTL ? 'پژوهشی' : 'Research'}</MenuItem>
                  <MenuItem value="social">{isRTL ? 'اجتماعی' : 'Social'}</MenuItem>
                  <MenuItem value="professional">{isRTL ? 'حرفه‌ای' : 'Professional'}</MenuItem>
                  <MenuItem value="technical">{isRTL ? 'فنی' : 'Technical'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{isRTL ? 'وضعیت' : 'Status'}</InputLabel>
                <Select value={formData.status} onChange={handleChange('status')}>
                  <MenuItem value="draft">{isRTL ? 'پیش‌نویس' : 'Draft'}</MenuItem>
                  <MenuItem value="published">{isRTL ? 'منتشر شده' : 'Published'}</MenuItem>
                  <MenuItem value="cancelled">{isRTL ? 'لغو شده' : 'Cancelled'}</MenuItem>
                  <MenuItem value="completed">{isRTL ? 'تکمیل شده' : 'Completed'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={isRTL ? 'حداکثر شرکت‌کنندگان' : 'Max Participants'}
                value={formData.maxParticipants}
                onChange={handleChange('maxParticipants')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.registrationRequired}
                    onChange={handleChange('registrationRequired')}
                  />
                }
                label={isRTL ? 'نیاز به ثبت‌نام' : 'Registration Required'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label={isRTL ? 'مهلت ثبت‌نام' : 'Registration Deadline'}
                value={formData.registrationDeadline}
                onChange={handleDateChange('registrationDeadline')}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label={isRTL ? 'ایمیل تماس' : 'Contact Email'}
                value={formData.contactEmail}
                onChange={handleChange('contactEmail')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isRTL ? 'تلفن تماس' : 'Contact Phone'}
                value={formData.contactPhone}
                onChange={handleChange('contactPhone')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={isRTL ? 'آدرس تصویر' : 'Image URL'}
                value={formData.imageUrl}
                onChange={handleChange('imageUrl')}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {isRTL ? 'برچسب‌ها' : 'Tags'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  size="small"
                  placeholder={isRTL ? 'افزودن برچسب...' : 'Add tag...'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant="outlined" size="small">
                  {isRTL ? 'افزودن' : 'Add'}
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
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
    </LocalizationProvider>
  );
}
