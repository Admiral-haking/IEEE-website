"use client";

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import HealthCheck from '@/components/HealthCheck';

export default function CapabilitiesSection() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';

  return (
    <Box id="capabilities" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {locale === 'fa' ? 'حوزه‌های تخصصی و پژوهشی' : 'Research & Specialized Areas'}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          {locale === 'fa' 
            ? 'انجمن علمی مهندسی کامپیوتر دانشگاه صنعتی قوچان در زمینه‌های مختلف فناوری اطلاعات و مهندسی کامپیوتر فعالیت می‌کند'
            : 'Computer Engineering Scientific Association at Quchan University of Technology operates in various fields of information technology and computer engineering'
          }
        </Typography>
      </Stack>
      <HealthCheck />
    </Box>
  );
}

