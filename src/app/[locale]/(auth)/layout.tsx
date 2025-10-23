import React from 'react';
import Providers from '@/components/Providers';
import AuthLayout from '@/layouts/AuthLayout';

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  // Providers at root already include Theme and i18n; keeping this simple layout wrapper
  return <AuthLayout>{children}</AuthLayout>;
}
