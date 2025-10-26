"use client";`r`nimport { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import StatsDialog from './components/StatsDialog';

type Row = { 
  id: string; 
  key: string;
  value: number | string;
  label: string;
  labelEn?: string;
  category: string;
  type: string;
  unit?: string;
  unitEn?: string;
  icon?: string;
  color?: string;
  order: number;
  visible: boolean;
  locale: string;
};

export default function StatsAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibleFilter, setVisibleFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStats, setEditingStats] = useState<Row | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; stats: Row | null }>({ open: false, stats: null });

  const [{ data, loading }, refetch] = useAxios({ 
    url: '/api/stats', 
    params: { 
      page: page + 1, 
      pageSize, 
      q: searchQuery || undefined,
      category: categoryFilter || undefined,
      visible: visibleFilter === 'true' ? true : visibleFilter === 'false' ? false : undefined,
      locale 
    } 
  });

  const [, deleteReq] = useAxios({ method: 'DELETE' }, { manual: true });
  const [, reorderReq] = useAxios({ method: 'POST' }, { manual: true });

  const items: Row[] = data?.items || [];
  const total = data?.total || 0;

  const handleAdd = () => {
    setEditingStats(null);
    setDialogOpen(true);
  };

  const handleEdit = (stats: Row) => {
    setEditingStats(stats);
    setDialogOpen(true);
  };

  const handleDelete = (stats: Row) => {
    setConfirmDelete({ open: true, stats });
  };

  const confirmDeleteStats = async () => {
    if (confirmDelete.stats) {
      await deleteReq({ url: `/api/stats/${confirmDelete.stats.id}` });
      await refetch();
      setConfirmDelete({ open: false, stats: null });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const statIds = newItems.map(item => item.id);
    await reorderReq({ url: '/api/stats', data: { statIds } });
    await refetch();
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      members: locale === 'fa' ? 'اعضا' : 'Members',
      projects: locale === 'fa' ? 'پروژه‌ها' : 'Projects',
      publications: locale === 'fa' ? 'انتشارات' : 'Publications',
      events: locale === 'fa' ? 'رویدادها' : 'Events',
      achievements: locale === 'fa' ? 'دستاوردها' : 'Achievements',
      general: locale === 'fa' ? 'عمومی' : 'General'
    };
    return categoryLabels[category] || category;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      number: locale === 'fa' ? 'عدد' : 'Number',
      text: locale === 'fa' ? 'متن' : 'Text',
      percentage: locale === 'fa' ? 'درصد' : 'Percentage',
      currency: locale === 'fa' ? 'ارز' : 'Currency'
    };
    return typeLabels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'primary';
      case 'text': return 'default';
      case 'percentage': return 'success';
      case 'currency': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {locale === 'fa' ? 'مدیریت آمار' : 'Stats Management'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === 'fa' ? 'مدیریت آمار و اطلاعات نمایشی سایت' : 'Manage website statistics and display information'}
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" color="primary" onClick={handleAdd} startIcon={<AddIcon />}>
            {locale === 'fa' ? 'افزودن آمار' : 'Add Stats'}
          </Button>
        </Stack>
      </Stack>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder={locale === 'fa' ? 'جستجو در آمار...' : 'Search stats...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'دسته‌بندی' : 'Category'}</InputLabel>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'همه' : 'All'}</MenuItem>
            <MenuItem value="members">{getCategoryLabel('members')}</MenuItem>
            <MenuItem value="projects">{getCategoryLabel('projects')}</MenuItem>
            <MenuItem value="publications">{getCategoryLabel('publications')}</MenuItem>
            <MenuItem value="events">{getCategoryLabel('events')}</MenuItem>
            <MenuItem value="achievements">{getCategoryLabel('achievements')}</MenuItem>
            <MenuItem value="general">{getCategoryLabel('general')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{locale === 'fa' ? 'نمایش' : 'Visible'}</InputLabel>
          <Select value={visibleFilter} onChange={(e) => setVisibleFilter(e.target.value)}>
            <MenuItem value="">{locale === 'fa' ? 'همه' : 'All'}</MenuItem>
            <MenuItem value="true">{locale === 'fa' ? 'نمایش' : 'Visible'}</MenuItem>
            <MenuItem value="false">{locale === 'fa' ? 'مخفی' : 'Hidden'}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stats-table">
          {(provided: any) => (
            <TableContainer ref={provided.innerRef} {...provided.droppableProps}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell width={50}></TableCell>
                    <TableCell>{locale === 'fa' ? 'کلید' : 'Key'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'مقدار' : 'Value'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'برچسب' : 'Label'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'دسته‌بندی' : 'Category'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'نوع' : 'Type'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'نمایش' : 'Visible'}</TableCell>
                    <TableCell>{locale === 'fa' ? 'ترتیب' : 'Order'}</TableCell>
                    <TableCell align="right">{locale === 'fa' ? 'عملیات' : 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(provided: any, snapshot: any) => (
                        <TableRow 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          hover
                          sx={{
                            backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit'
                          }}
                        >
                          <TableCell {...provided.dragHandleProps}>
                            <DragIcon color="action" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {row.key}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {row.value}
                              {row.unit && (
                                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                  {row.unit}
                                </Typography>
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {row.label}
                            </Typography>
                            {row.labelEn && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {row.labelEn}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip label={getCategoryLabel(row.category)} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getTypeLabel(row.type)} 
                              size="small" 
                              color={getTypeColor(row.type) as any}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={row.visible}
                                  size="small"
                                  onChange={async (e) => {
                                    // Here you would update the visibility
                                    console.log('Toggle visibility for', row.id, e.target.checked);
                                  }}
                                />
                              }
                              label=""
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {row.order}
                            </Typography>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

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
        labelRowsPerPage={locale === 'fa' ? 'ردیف در صفحه:' : 'Rows per page:'}
        labelDisplayedRows={({ from, to, count }: { from: number; to: number; count: number }) => 
          locale === 'fa' 
            ? `${from}-${to} از ${count !== -1 ? count : `${to} از بیش از ${to}`}`
            : `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* Stats Dialog */}
      <StatsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        stats={editingStats}
        onSave={() => {
          setDialogOpen(false);
          refetch();
        }}
        locale={locale}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, stats: null })}>
        <DialogTitle>
          {locale === 'fa' ? 'تأیید حذف' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {locale === 'fa' 
              ? `آیا از حذف آمار "${confirmDelete.stats?.label}" مطمئن هستید؟`
              : `Are you sure you want to delete the stats "${confirmDelete.stats?.label}"?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, stats: null })}>
            {locale === 'fa' ? 'انصراف' : 'Cancel'}
          </Button>
          <Button onClick={confirmDeleteStats} color="error">
            {locale === 'fa' ? 'حذف' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}





