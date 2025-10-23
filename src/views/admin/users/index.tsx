"use client";

import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import UserTable, { UserRow } from './components/UserTable';
import UserDialog from './components/UserDialog';
import ConfirmDialog from './components/ConfirmDialog';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';

export default function UsersView() {
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState<UserRow | undefined>(undefined);
  const [query, setQuery] = React.useState('');
  const [confirm, setConfirm] = React.useState<{ open: boolean; user?: UserRow }>({ open: false });
  const { t } = useTranslation();
  const [, refetchList] = useAxios({ url: '/api/users', params: { q: query } }, { manual: true });
  const [, createUser] = useAxios({ url: '/api/users', method: 'POST' }, { manual: true });
  const [, updateUser] = useAxios({ method: 'PATCH' }, { manual: true });
  const [, deleteUser] = useAxios({ method: 'DELETE' }, { manual: true });

  const onAdd = () => { setInitial(undefined); setOpen(true); };
  const onEdit = (u: UserRow) => { setInitial(u); setOpen(true); };
  const onDelete = async (u: UserRow) => {
    await deleteUser({ url: `/api/users/${u.id}` });
    await refetchList();
  };
  const onSubmit = async (values: any) => {
    if (initial?.id) {
      await updateUser({ url: `/api/users/${initial.id}`, data: values });
    } else {
      await createUser({ data: values });
    }
    await refetchList();
  };

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{t('users')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('manage_users_subtitle')}</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
          <TextField placeholder={t('search_users_placeholder') as string} size="small" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') refetchList(); }} />
          <Button variant="contained" color="secondary" onClick={onAdd}>{t('add_user')}</Button>
        </Stack>
      </Stack>

      <UserTable onEdit={onEdit} onDelete={(u) => setConfirm({ open: true, user: u })} />

      <UserDialog open={open} onClose={() => setOpen(false)} initial={initial} onSubmit={onSubmit} />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
        onConfirm={async () => { if (confirm.user) await onDelete(confirm.user); }}
        title={t('delete_user_title')}
        message={t('delete_user_message', { email: confirm.user?.email || t('this_user') })}
      />
    </Container>
  );

}
