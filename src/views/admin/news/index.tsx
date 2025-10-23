"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Stack, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import NewsDialog from './components/NewsDialog';

type Row = { 
  id: string; 
  title: string; 
  titleEn?: string;
  excerpt: string;
  type: string;
  category: string;
  status: string;
  featured: boolean;
  priority: string;
  author: string;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  imageUrl?: string;
};

export default function NewsAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; news: Row | null }>({ open: false, news: null });

  const [{ data, loading }, refetch] = useAxios({ 
    url: '/api/news', 
    params: { 
      page: page + 1, 
      pageSize, 
      q: searchQuery || undefined,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      featured: featuredFilter === 'true' ? true : featuredFilter === 'false' ? false : undefined,
      locale 
    } 
  });

  const [, deleteReq] = useAxios({ method: 'DELETE' }, { manual: true });

  const items: Row[] = data?.items || [];
  const total = data?.total || 0;

  const handleAdd = () => {
    setEditingNews(null);
    setDialogOpen(true);
  };

  const handleEdit = (news: Row) => {
    setEditingNews(news);
    setDialogOpen(true);
  };

  const handleDelete = (news: Row) => {
    setConfirmDelete({ open: true, news });
  };

  const confirmDeleteNews = async () => {
    if (confirmDelete.news) {
      await deleteReq({ url: `/api/news/${confirmDelete.news.id}` });
      await refetch();
      setConfirmDelete({ open: false, news: null });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      news: locale === 'fa' ? 'Ø§Ø®Ø¨Ø§Ø±' : 'News',
      achievement: locale === 'fa' ? 'Ø¯Ø³ØªØ§ÙˆØ±Ø¯' : 'Achievement',
      announcement: locale === 'fa' ? 'Ø§Ø·Ù„Ø§Ø¹ÛŒÙ‡' : 'Announcement',
      publication: locale === 'fa' ? 'Ø§Ù†ØªØ´Ø§Ø±Ø§Øª' : 'Publication',
      award: locale === 'fa' ? 'Ø¬Ø§ÛŒØ²Ù‡' : 'Award',
      event: locale === 'fa' ? 'Ø±ÙˆÛŒØ¯Ø§Ø¯' : 'Event'
    };
    return typeLabels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      academic: locale === 'fa' ? 'Ø¢Ú©Ø§Ø¯Ù…ÛŒÚ©' : 'Academic',
      research: locale === 'fa' ? 'Ù¾Ú˜ÙˆÙ‡Ø´ÛŒ' : 'Research',
      social: locale === 'fa' ? 'Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ' : 'Social',
      professional: locale === 'fa' ? 'Ø­Ø±ÙÙ‡â€ŒØ§ÛŒ' : 'Professional',
      technical: locale === 'fa' ? 'ÙÙ†ÛŒ' : 'Technical',
      general: locale === 'fa' ? 'Ø¹Ù…ÙˆÙ…ÛŒ' : 'General'
    };
    return categoryLabels[category] || category;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {locale === 'fa' ? 'Ù…Ø¯ÛŒØ±ÛŒØª Ø§Ø®Ø¨Ø§Ø±' : 'News Management'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === 'fa' ? 'Ù…Ø¯ÛŒØ±ÛŒØª Ø§Ø®Ø¨Ø§Ø±ØŒ Ø¯Ø³ØªØ§ÙˆØ±Ø¯Ù‡Ø§ Ùˆ Ø§Ø·Ù„Ø§Ø¹ÛŒÙ‡â€ŒÙ‡Ø§' : 'Manage news, achievements and announcements'}
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<AddIcon />}>
            {locale === 'fa' ? 'Ø§ÙØ²ÙˆØ¯Ù† Ø®Ø¨Ø±' : 'Add News'}
          </Button>
        </Stack>
      </Stack>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder={locale === 'fa' ? 'Ø¬Ø³ØªØ¬Ùˆ Ø¯Ø± Ø§Ø®Ø¨Ø§Ø±...' : 'Search news...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'Ù†ÙˆØ¹' : 'Type'}</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'Ù‡Ù…Ù‡' : 'All'}</MenuItem>
            <MenuItem value="news">{getTypeLabel('news')}</MenuItem>
            <MenuItem value="achievement">{getTypeLabel('achievement')}</MenuItem>
            <MenuItem value="announcement">{getTypeLabel('announcement')}</MenuItem>
            <MenuItem value="publication">{getTypeLabel('publication')}</MenuItem>
            <MenuItem value="award">{getTypeLabel('award')}</MenuItem>
            <MenuItem value="event">{getTypeLabel('event')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'ÙˆØ¶Ø¹ÛŒØª' : 'Status'}</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'Ù‡Ù…Ù‡' : 'All'}</MenuItem>
            <MenuItem value="draft">{locale === 'fa' ? 'Ù¾ÛŒØ´â€ŒÙ†ÙˆÛŒØ³' : 'Draft'}</MenuItem>
            <MenuItem value="published">{locale === 'fa' ? 'Ù…Ù†ØªØ´Ø± Ø´Ø¯Ù‡' : 'Published'}</MenuItem>
            <MenuItem value="archived">{locale === 'fa' ? 'Ø¢Ø±Ø´ÛŒÙˆ Ø´Ø¯Ù‡' : 'Archived'}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'ÙˆÛŒÚ˜Ù‡' : 'Featured'}</InputLabel>
          <Select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'Ù‡Ù…Ù‡' : 'All'}</MenuItem>
            <MenuItem value="true">{locale === 'fa' ? 'ÙˆÛŒÚ˜Ù‡' : 'Featured'}</MenuItem>
            <MenuItem value="false">{locale === 'fa' ? 'Ø¹Ø§Ø¯ÛŒ' : 'Normal'}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{locale === 'fa' ? 'ØªØµÙˆÛŒØ±' : 'Image'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ø¹Ù†ÙˆØ§Ù†' : 'Title'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ù†ÙˆØ¹' : 'Type'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ' : 'Category'}</TableCell>
              <TableCell>{locale === 'fa' ? 'ÙˆØ¶Ø¹ÛŒØª' : 'Status'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ø§ÙˆÙ„ÙˆÛŒØª' : 'Priority'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ù†ÙˆÛŒØ³Ù†Ø¯Ù‡' : 'Author'}</TableCell>
              <TableCell>{locale === 'fa' ? 'Ø¨Ø§Ø²Ø¯ÛŒØ¯' : 'Views'}</TableCell>
              <TableCell align="right">{locale === 'fa' ? 'Ø¹Ù…Ù„ÛŒØ§Øª' : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Avatar 
                    src={row.imageUrl} 
                    sx={{ width: 40, height: 40 }}
                    variant="rounded"
                  >
                    {row.title.charAt(0).toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {row.title}
                  </Typography>
                  {row.titleEn && (
                    <Typography variant="caption" color="text.secondary">
                      {row.titleEn}
                    </Typography>
                  )}
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    {row.excerpt.length > 100 ? `${row.excerpt.substring(0, 100)}...` : row.excerpt}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={getTypeLabel(row.type)} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={getCategoryLabel(row.category)} size="small" variant="outlined" color="primary" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    color={getStatusColor(row.status) as any}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.priority} 
                    size="small" 
                    color={getPriorityColor(row.priority) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.author}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.viewCount}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={locale === 'fa' ? 'Ù…Ø´Ø§Ù‡Ø¯Ù‡' : 'View'}>
                      <IconButton size="small">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={locale === 'fa' ? 'ÙˆÛŒØ±Ø§ÛŒØ´' : 'Edit'}>
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={locale === 'fa' ? 'Ø­Ø°Ù' : 'Delete'}>
                      <IconButton size="small" onClick={() => handleDelete(row)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={( _evt: unknown, newPage: number ) => setPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={locale === 'fa' ? 'Ø±Ø¯ÛŒÙ Ø¯Ø± ØµÙØ­Ù‡:' : 'Rows per page:'}
        labelDisplayedRows={({ from, to, count }: { from: number; to: number; count: number }) => 
          locale === 'fa' 
            ? `${from}-${to} Ø§Ø² ${count !== -1 ? count : `${to} Ø§Ø² Ø¨ÛŒØ´ Ø§Ø² ${to}`}`
            : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* News Dialog */}
      <NewsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        news={editingNews}
        onSave={() => {
          setDialogOpen(false);
          refetch();
        }}
        locale={locale}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, news: null })}>
        <DialogTitle>
          {locale === 'fa' ? 'ØªØ£ÛŒÛŒØ¯ Ø­Ø°Ù' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {locale === 'fa' 
              ? `Ø¢ÛŒØ§ Ø§Ø² Ø­Ø°Ù Ø®Ø¨Ø± "${confirmDelete.news?.title}" Ù…Ø·Ù…Ø¦Ù† Ù‡Ø³ØªÛŒØ¯ØŸ`
              : `Are you sure you want to delete the news "${confirmDelete.news?.title}"?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, news: null })}>
            {locale === 'fa' ? 'Ø§Ù†ØµØ±Ø§Ù' : 'Cancel'}
          </Button>
          <Button onClick={confirmDeleteNews} color="error">
            {locale === 'fa' ? 'Ø­Ø°Ù' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

