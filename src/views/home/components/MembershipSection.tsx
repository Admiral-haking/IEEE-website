"use client";

import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function MembershipSection() {
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';

  const benefits = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'آموزش و کارگاه‌های تخصصی' : 'Education & Specialized Workshops',
      description: locale === 'fa' 
        ? 'شرکت در کارگاه‌ها، سمینارها و دوره‌های آموزشی تخصصی دانشگاه'
        : 'Participate in university workshops, seminars, and specialized training programs'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'شبکه‌سازی دانشجویی' : 'Student Networking',
      description: locale === 'fa'
        ? 'ارتباط با دانشجویان و اساتید دانشگاه در حوزه مهندسی کامپیوتر'
        : 'Connect with students and professors in computer engineering at the university'
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'پروژه‌های تحقیقاتی' : 'Research Projects',
      description: locale === 'fa'
        ? 'مشارکت در پروژه‌های تحقیقاتی و کارآموزی‌های تخصصی'
        : 'Participate in research projects and specialized internships'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'مسابقات و رویدادها' : 'Competitions & Events',
      description: locale === 'fa'
        ? 'شرکت در مسابقات برنامه‌نویسی، هکاتون‌ها و رویدادهای علمی'
        : 'Participate in programming competitions, hackathons, and scientific events'
    }
  ];

  return (
    <Box id="membership" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main' }}>
          {locale === 'fa' ? 'عضویت در انجمن علمی' : 'Scientific Association Membership'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', lineHeight: 1.6 }}>
          {locale === 'fa' 
            ? 'به انجمن علمی مهندسی کامپیوتر دانشگاه صنعتی قوچان بپیوندید'
            : 'Join the Computer Engineering Scientific Association at Quchan University of Technology'
          }
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {benefits.map((benefit, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Card sx={{ 
              height: '100%', 
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: 4,
                zIndex: 10
              }
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {benefit.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" spacing={3}>
        <Button 
          component={NextLink} 
          href={`/${locale}/signup`} 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
        >
          {t('become_member')}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {locale === 'fa' 
            ? 'عضویت رایگان برای دانشجویان و متخصصان'
            : 'Free membership for students and professionals'
          }
        </Typography>
      </Stack>
    </Box>
  );
}
