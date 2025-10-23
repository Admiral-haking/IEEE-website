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
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import EventDialog from './components/EventDialog';

type Row = { 
  id: string; 
  title: string; 
  titleEn?: string;
  date: string; 
  time: string;
  type: string;
  category: string;
  status: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
};

export default function EventsAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; event: Row | null }>({ open: false, event: null });

  const [{ data, loading }, refetch] = useAxios({ 
    url: '/api/events', 
    params: { 
      page: page + 1, 
      pageSize, 
      q: searchQuery || undefined,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      locale 
    } 
  });

  const [, deleteReq] = useAxios({ method: 'DELETE' }, { manual: true });

  const items: Row[] = data?.items || [];
  const total = data?.total || 0;

  const handleAdd = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEdit = (event: Row) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleDelete = (event: Row) => {
    setConfirmDelete({ open: true, event });
  };

  const confirmDeleteEvent = async () => {
    if (confirmDelete.event) {
      await deleteReq({ url: `/api/events/${confirmDelete.event.id}` });
      await refetch();
      setConfirmDelete({ open: false, event: null });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      workshop: locale === 'fa' ? 'کارگاه' : 'Workshop',
      seminar: locale === 'fa' ? 'سمینار' : 'Seminar',
      conference: locale === 'fa' ? 'کنفرانس' : 'Conference',
      contest: locale === 'fa' ? 'مسابقه' : 'Contest',
      meeting: locale === 'fa' ? 'جلسه' : 'Meeting',
      other: locale === 'fa' ? 'سایر' : 'Other'
    };
    return typeLabels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      academic: locale === 'fa' ? 'آکادمیک' : 'Academic',
      research: locale === 'fa' ? 'پژوهشی' : 'Research',
      social: locale === 'fa' ? 'اجتماعی' : 'Social',
      professional: locale === 'fa' ? 'حرفه‌ای' : 'Professional',
      technical: locale === 'fa' ? 'فنی' : 'Technical'
    };
    return categoryLabels[category] || category;
  };

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {locale === 'fa' ? 'مدیریت رویدادها' : 'Events Management'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === 'fa' ? 'مدیریت رویدادها و فعالیت‌های انجمن' : 'Manage association events and activities'}
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<AddIcon />}>
            {locale === 'fa' ? 'افزودن رویداد' : 'Add Event'}
          </Button>
        </Stack>
      </Stack>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder={locale === 'fa' ? 'جستجو در رویدادها...' : 'Search events...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'نوع' : 'Type'}</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'همه' : 'All'}</MenuItem>
            <MenuItem value="workshop">{getTypeLabel('workshop')}</MenuItem>
            <MenuItem value="seminar">{getTypeLabel('seminar')}</MenuItem>
            <MenuItem value="conference">{getTypeLabel('conference')}</MenuItem>
            <MenuItem value="contest">{getTypeLabel('contest')}</MenuItem>
            <MenuItem value="meeting">{getTypeLabel('meeting')}</MenuItem>
            <MenuItem value="other">{getTypeLabel('other')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'وضعیت' : 'Status'}</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'همه' : 'All'}</MenuItem>
            <MenuItem value="draft">{locale === 'fa' ? 'پیش‌نویس' : 'Draft'}</MenuItem>
            <MenuItem value="published">{locale === 'fa' ? 'منتشر شده' : 'Published'}</MenuItem>
            <MenuItem value="cancelled">{locale === 'fa' ? 'لغو شده' : 'Cancelled'}</MenuItem>
            <MenuItem value="completed">{locale === 'fa' ? 'تکمیل شده' : 'Completed'}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{locale === 'fa' ? 'عنوان' : 'Title'}</TableCell>
              <TableCell>{locale === 'fa' ? 'تاریخ' : 'Date'}</TableCell>
              <TableCell>{locale === 'fa' ? 'نوع' : 'Type'}</TableCell>
              <TableCell>{locale === 'fa' ? 'دسته‌بندی' : 'Category'}</TableCell>
              <TableCell>{locale === 'fa' ? 'وضعیت' : 'Status'}</TableCell>
              <TableCell>{locale === 'fa' ? 'شرکت‌کنندگان' : 'Participants'}</TableCell>
              <TableCell align="right">{locale === 'fa' ? 'عملیات' : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {row.title}
                  </Typography>
                  {row.titleEn && (
                    <Typography variant="caption" color="text.secondary">
                      {row.titleEn}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(row.date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.time}
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
                  {row.maxParticipants ? (
                    <Typography variant="body2">
                      {row.currentParticipants || 0} / {row.maxParticipants}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {row.currentParticipants || 0}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={locale === 'fa' ? 'ویرایش' : 'Edit'}>
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={locale === 'fa' ? 'حذف' : 'Delete'}>
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
         onPageChange={(_: any, newPage: any) => setPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e: any) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={locale === 'fa' ? 'ردیف در صفحه:' : 'Rows per page:'}
         labelDisplayedRows={({ from, to, count }: any) =>
          locale === 'fa' 
            ? `${from}-${to} از ${count !== -1 ? count : `${to} از بیش از ${to}`}`
            : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        event={editingEvent}
        onSave={() => {
          setDialogOpen(false);
          refetch();
        }}
        locale={locale}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, event: null })}>
        <DialogTitle>
          {locale === 'fa' ? 'تأیید حذف' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {locale === 'fa' 
              ? `آیا از حذف رویداد "${confirmDelete.event?.title}" مطمئن هستید؟`
              : `Are you sure you want to delete the event "${confirmDelete.event?.title}"?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, event: null })}>
            {locale === 'fa' ? 'انصراف' : 'Cancel'}
          </Button>
          <Button onClick={confirmDeleteEvent} color="error">
            {locale === 'fa' ? 'حذف' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
