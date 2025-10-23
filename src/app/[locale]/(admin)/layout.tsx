import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { requireAdmin } from '@/server/auth/guard';

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminLayout>{children}</AdminLayout>;
}
