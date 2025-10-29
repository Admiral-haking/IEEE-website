"use client";

import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Tooltip } from '@mui/material';
import useAxios from 'axios-hooks';
import SolutionDialog from './components/SolutionDialog';
import ConfirmDialog from '@/views/admin/users/components/ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

type Row = { id: string; title: string; slug?: string; category: 'software'|'hardware'|'networking'; summary?: string; contentHtml?: string; published: boolean };

export default function SolutionsAdminView() {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState<Partial<Row> | undefined>(undefined);
  const [confirm, setConfirm] = React.useState<{ open: boolean; row?: Row }>({ open: false });

  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? (parts[0] as 'en'|'fa') : 'en';
  const [{ data }, refetch] = useAxios<{ items: Row[]; total: number }>({ url: '/api/solutions', params: { q: query, page: page + 1, pageSize: rowsPerPage, locale } });
  const [, createReq] = useAxios({ url: '/api/solutions', method: 'POST' }, { manual: true });
  const [, updateReq] = useAxios({ method: 'PATCH' }, { manual: true });
  const [, deleteReq] = useAxios({ method: 'DELETE' }, { manual: true });

  const items: Row[] = data?.items || [];
  const total = data?.total || 0;

  const onAdd = () => { setInitial(undefined); setOpen(true); };
  const onEdit = (row: Row) => { setInitial(row); setOpen(true); };
  const onSubmit = async (values: any) => {
    if ((initial as any)?.id) await updateReq({ url: `/api/solutions/${(initial as any).id}`, data: values });
    else await createReq({ data: { ...values, locale } });
    await refetch();
  };
  const onDelete = async (row: Row) => {
    await deleteReq({ url: `/api/solutions/${row.id}` });
    await refetch();
  };

  // Precompute texts to avoid complex union type inference in JSX
  const tSolutions = String(t('solutions'));
  const tSolutionsSub = String(t('solutions_admin_sub'));
  const tSearchSolutions = String(t('search_solutions'));
  const tTitleLabel = String(t('title_label'));
  const tCategoryLabel = String(t('category_label'));
  const tPublished = String(t('published'));
  const tActions = String(t('actions'));
  const tYes = String(t('yes'));
  const tNo = String(t('no'));
  const tEdit = String(t('edit'));
  const tDelete = String(t('delete'));
  const tDeleteTitle = String(t('delete_solution_title'));
  const tDeleteMessage = String(t('delete_solution_message'));

  const headerBox = (
    <div>
      <h5 style={{ fontWeight: 700, margin: 0 }}>{tSolutions}</h5>
      <p style={{ margin: 0, opacity: 0.7 }}>{tSolutionsSub}</p>
    </div>
  ) as any;

  const header = (
    <Stack spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 2 }}>
      {headerBox}
      <Stack spacing={1.5} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField size="small" placeholder={tSearchSolutions} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') refetch(); }} />
        <Button variant="contained" color="secondary" onClick={onAdd}>{t('add_solution')}</Button>
      </Stack>
    </Stack>
  ) as any;

  const contentEl: any = (
    <Container sx={{ py: 3 }}>
      {header}
      
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{tTitleLabel}</TableCell>
              <TableCell>{tCategoryLabel}</TableCell>
              <TableCell>{tPublished}</TableCell>
              <TableCell align="right">{tActions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.title}</TableCell>
                <TableCell><Chip label={String(t(row.category))} size="small" /></TableCell>
                <TableCell>{row.published ? tYes : tNo}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={tEdit}><IconButton size="small" onClick={() => onEdit(row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={tDelete}><IconButton size="small" onClick={() => setConfirm({ open: true, row })}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={page} onPageChange={( _evt: unknown, p: number ) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

      <SolutionDialog open={open} onClose={() => setOpen(false)} initial={initial} onSubmit={onSubmit} />
      <ConfirmDialog open={confirm.open} onClose={() => setConfirm({ open: false })} onConfirm={async () => { if (confirm.row) await onDelete(confirm.row); }} title={tDeleteTitle} message={tDeleteMessage} />
    </Container>
  );

  return contentEl as JSX.Element;
}
