"use client";

import React from 'react';
import { Box, Button, Container, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, TextField, Chip } from '@mui/material';
import useAxios from 'axios-hooks';
import MemberDialog from './components/MemberDialog';
import ConfirmDialog from '@/views/admin/users/components/ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

type Row = { id: string; name: string; email?: string; role: string; discipline: 'software'|'hardware'|'networking'; locale: 'en'|'fa' };

export default function TeamMembersAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? (parts[0] as 'en'|'fa') : 'en';

  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState<Partial<Row> | undefined>(undefined);
  const [confirm, setConfirm] = React.useState<{ open: boolean; row?: Row }>({ open: false });

  const [{ data }, refetch] = useAxios({ url: '/api/team', params: { q: query, page: page + 1, pageSize: rowsPerPage, locale } });
  const [, createReq] = useAxios({ url: '/api/team', method: 'POST' }, { manual: true });
  const [, updateReq] = useAxios({ method: 'PATCH' }, { manual: true });
  const [, deleteReq] = useAxios({ method: 'DELETE' }, { manual: true });

  const items: any[] = data?.items || [];
  const total = data?.total || 0;

  const onAdd = () => { setInitial(undefined); setOpen(true); };
  const onEdit = (row: any) => { setInitial(row); setOpen(true); };
  const onSubmit = async (values: any) => {
    if ((initial as any)?.id) await updateReq({ url: `/api/team/${(initial as any).id}`, data: values });
    else await createReq({ data: { ...values, locale } });
    await refetch();
  };
  const onDelete = async (row: any) => { await deleteReq({ url: `/api/team/${row.id}` }); await refetch(); };

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{t('team_members')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('team_admin_sub')}</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField size="small" placeholder={t('search_users_placeholder') as string} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') refetch(); }} />
          <Button variant="contained" color="secondary" onClick={onAdd}>{t('add_member')}</Button>
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{t('name_label')}</TableCell>
              <TableCell>{t('email_label')}</TableCell>
              <TableCell>{t('role_label')}</TableCell>
              <TableCell>{t('discipline_label')}</TableCell>
              <TableCell>{t('default_locale')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email || 'â€”'}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell><Chip size="small" label={t(row.discipline)} /></TableCell>
                <TableCell>{row.locale.toUpperCase()}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={t('edit') as string}><IconButton size="small" onClick={() => onEdit(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={t('delete') as string}><IconButton size="small" onClick={() => setConfirm({ open: true, row })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={page} onPageChange={( _evt: unknown, p: number ) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <MemberDialog open={open} onClose={() => setOpen(false)} initial={initial} onSubmit={onSubmit} />
      <ConfirmDialog open={confirm.open} onClose={() => setConfirm({ open: false })} onConfirm={async () => { if (confirm.row) await onDelete(confirm.row); }} title={t('delete_member_title')} message={t('delete_member_message')} />
    </Container>
  );
}


