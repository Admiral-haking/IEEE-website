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
  Tabs,
  Tab
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { faIR } from 'date-fns/locale';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import Editor from '@/components/Editor';

interface NewsDialogProps {
  open: boolean;
  onClose: () => void;
  news: any;
  onSave: () => void;
  locale: string;
}

export default function NewsDialog({ open, onClose, news, onSave, locale }: NewsDialogProps) {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    contentHtml: '',
    contentHtmlEn: '',
    type: 'news',
    category: 'general',
    status: 'draft',
    featured: false,
    priority: 'medium',
    imageUrl: '',
    imageAlt: '',
    imageAltEn: '',
    tags: [] as string[],
    author: '',
    authorEn: '',
    publishedAt: null as Date | null,
    locale: locale as 'fa' | 'en',
    createdBy: 'admin',
    updatedBy: 'admin'
  });

  const [tagInput, setTagInput] = useState('');

  const [, createNews] = useAxios({ method: 'POST' }, { manual: true });
  const [, updateNews] = useAxios({ method: 'PATCH' }, { manual: true });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        titleEn: news.titleEn || '',
        excerpt: news.excerpt || '',
        excerptEn: news.excerptEn || '',
        content: news.content || '',
        contentEn: news.contentEn || '',
        contentHtml: news.contentHtml || '',
        contentHtmlEn: news.contentHtmlEn || '',
        type: news.type || 'news',
        category: news.category || 'general',
        status: news.status || 'draft',
        featured: news.featured || false,
        priority: news.priority || 'medium',
        imageUrl: news.imageUrl || '',
        imageAlt: news.imageAlt || '',
        imageAltEn: news.imageAltEn || '',
        tags: news.tags || [],
        author: news.author || '',
        authorEn: news.authorEn || '',
        publishedAt: news.publishedAt ? new Date(news.publishedAt) : null,
        locale: news.locale || locale as 'fa' | 'en',
        createdBy: news.createdBy || 'admin',
        updatedBy: 'admin'
      });
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        titleEn: '',
        excerpt: '',
        excerptEn: '',
        content: '',
        contentEn: '',
        contentHtml: '',
        contentHtmlEn: '',
        type: 'news',
        category: 'general',
        status: 'draft',
        featured: false,
        priority: 'medium',
        imageUrl: '',
        imageAlt: '',
        imageAltEn: '',
        tags: [],
        author: '',
        authorEn: '',
        publishedAt: null,
        locale: locale as 'fa' | 'en',
        createdBy: 'admin',
        updatedBy: 'admin'
      }));
    }
  }, [news, locale]);

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData(prev => ({ ...prev, [field]: date }));
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

  const handleContentChange = (content: string, isEn: boolean = false) => {
    setFormData(prev => ({
      ...prev,
      [isEn ? 'contentHtmlEn' : 'contentHtml']: content
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        publishedAt: formData.publishedAt?.toISOString(),
        content: formData.contentHtml, // Use HTML content as plain text content
        contentEn: formData.contentHtmlEn
      };

      if (news) {
        await updateNews({ url: `/api/news/${news.id}`, data: submitData });
      } else {
        await createNews({ url: '/api/news', data: submitData });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const isRTL = locale === 'fa';

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={isRTL ? faIR : undefined}
    >
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {news ? 
            (isRTL ? 'ویرایش خبر' : 'Edit News') : 
            (isRTL ? 'افزودن خبر جدید' : 'Add New News')
          }
        </DialogTitle>
        <DialogContent>
           <Tabs value={tabValue} onChange={(_: any, newValue: any) => setTabValue(newValue)} sx={{ mb: 2 }}>
            <Tab label={isRTL ? 'اطلاعات اصلی' : 'Basic Info'} />
            <Tab label={isRTL ? 'محتوای فارسی' : 'Persian Content'} />
            <Tab label={isRTL ? 'محتوای انگلیسی' : 'English Content'} />
            <Tab label={isRTL ? 'تنظیمات' : 'Settings'} />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2}>
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
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={isRTL ? 'خلاصه (فارسی)' : 'Excerpt (Persian)'}
                  value={formData.excerpt}
                  onChange={handleChange('excerpt')}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={isRTL ? 'خلاصه (انگلیسی)' : 'Excerpt (English)'}
                  value={formData.excerptEn}
                  onChange={handleChange('excerptEn')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{isRTL ? 'نوع' : 'Type'}</InputLabel>
                  <Select value={formData.type} onChange={handleChange('type')}>
                    <MenuItem value="news">{isRTL ? 'اخبار' : 'News'}</MenuItem>
                    <MenuItem value="achievement">{isRTL ? 'دستاورد' : 'Achievement'}</MenuItem>
                    <MenuItem value="announcement">{isRTL ? 'اطلاعیه' : 'Announcement'}</MenuItem>
                    <MenuItem value="publication">{isRTL ? 'انتشارات' : 'Publication'}</MenuItem>
                    <MenuItem value="award">{isRTL ? 'جایزه' : 'Award'}</MenuItem>
                    <MenuItem value="event">{isRTL ? 'رویداد' : 'Event'}</MenuItem>
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
                    <MenuItem value="general">{isRTL ? 'عمومی' : 'General'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={isRTL ? 'نویسنده (فارسی)' : 'Author (Persian)'}
                  value={formData.author}
                  onChange={handleChange('author')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={isRTL ? 'نویسنده (انگلیسی)' : 'Author (English)'}
                  value={formData.authorEn}
                  onChange={handleChange('authorEn')}
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={isRTL ? 'متن جایگزین تصویر (فارسی)' : 'Image Alt Text (Persian)'}
                  value={formData.imageAlt}
                  onChange={handleChange('imageAlt')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={isRTL ? 'متن جایگزین تصویر (انگلیسی)' : 'Image Alt Text (English)'}
                  value={formData.imageAltEn}
                  onChange={handleChange('imageAltEn')}
                />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isRTL ? 'محتوای فارسی' : 'Persian Content'}
              </Typography>
              <Editor
                 value={formData.contentHtml}
                onChange={(content) => handleContentChange(content, false)}
                placeholder={isRTL ? 'محتوای خبر را اینجا بنویسید...' : 'Write news content here...'}
              />
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isRTL ? 'محتوای انگلیسی' : 'English Content'}
              </Typography>
              <Editor
                value={formData.contentHtmlEn}
                onChange={(content) => handleContentChange(content, true)}
                placeholder={isRTL ? 'Write English content here...' : 'Write English content here...'}
              />
            </Box>
          )}

          {tabValue === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{isRTL ? 'وضعیت' : 'Status'}</InputLabel>
                  <Select value={formData.status} onChange={handleChange('status')}>
                    <MenuItem value="draft">{isRTL ? 'پیش‌نویس' : 'Draft'}</MenuItem>
                    <MenuItem value="published">{isRTL ? 'منتشر شده' : 'Published'}</MenuItem>
                    <MenuItem value="archived">{isRTL ? 'آرشیو شده' : 'Archived'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{isRTL ? 'اولویت' : 'Priority'}</InputLabel>
                  <Select value={formData.priority} onChange={handleChange('priority')}>
                    <MenuItem value="low">{isRTL ? 'پایین' : 'Low'}</MenuItem>
                    <MenuItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</MenuItem>
                    <MenuItem value="high">{isRTL ? 'بالا' : 'High'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={isRTL ? 'تاریخ انتشار' : 'Publish Date'}
                  value={formData.publishedAt}
                  onChange={handleDateChange('publishedAt')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={handleChange('featured')}
                    />
                  }
                  label={isRTL ? 'خبر ویژه' : 'Featured News'}
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
          )}
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
