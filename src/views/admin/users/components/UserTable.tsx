"use client";

import React from 'react';
import useAxios from 'axios-hooks';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export type UserRow = { id: string; name?: string; email: string; role: 'member'|'user'|'admin'; createdAt?: string };

export default function UserTable({ onEdit, onDelete }: { onEdit: (u: UserRow) => void; onDelete: (u: UserRow) => void }) {
  const { t } = useTranslation();
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [{ data, loading, error }, refetch] = useAxios({ url: '/api/users', params: { q, page: page + 1, pageSize: rowsPerPage } });

  const items: UserRow[] = data?.items || [];
  const total = data?.total || 0;

  return (
    <Box>
      {error && <Alert severity="error">{String((error as any)?.response?.data?.error || t('failed_load_users'))}</Alert>}
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{t('name_label')}</TableCell>
              <TableCell>{t('email_label')}</TableCell>
              <TableCell>{t('role_label')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress size={22} /></TableCell>
              </TableRow>
            )}
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center"><Typography color="text.secondary">{t('no_users_found')}</Typography></TableCell>
              </TableRow>
            )}
            {items.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.name || 'â€”'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.role === 'admin' ? t('user_role_admin') : u.role === 'member' ? (t('user_role_member') as any) : t('user_role_user')} 
                    size="small" 
                    color={u.role === 'admin' ? 'secondary' : u.role === 'member' ? 'primary' : 'default'} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={t('edit') as string}><IconButton size="small" onClick={() => onEdit(u)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={t('delete') as string}><IconButton size="small" onClick={() => onDelete(u)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        onPageChange={( _evt: unknown, p: number ) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />
    </Box>
  );
}

