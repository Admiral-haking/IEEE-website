"use client";

import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material';
import { usePathname } from 'next/navigation';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ElectricBorder from '@/components/ElectricBorder';
import PixelBlast from '@/components/PixelBlast';

export default function StudentActivities() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';

  const activities = [
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'مسابقات برنامه‌نویسی' : 'Programming Competitions',
      description: locale === 'fa' 
        ? 'شرکت در مسابقات برنامه‌نویسی محلی و ملی'
        : 'Participate in local and national programming competitions',
      tags: locale === 'fa' ? ['ACM', 'ICPC', 'هکاتون'] : ['ACM', 'ICPC', 'Hackathon']
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'کارگاه‌های آموزشی' : 'Educational Workshops',
      description: locale === 'fa'
        ? 'برگزاری کارگاه‌های تخصصی در زمینه‌های مختلف فناوری'
        : 'Organizing specialized workshops in various technology fields',
      tags: locale === 'fa' ? ['Python', 'AI', 'Web Dev'] : ['Python', 'AI', 'Web Dev']
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'پروژه‌های گروهی' : 'Group Projects',
      description: locale === 'fa'
        ? 'انجام پروژه‌های تحقیقاتی و عملی به صورت گروهی'
        : 'Conducting research and practical projects in groups',
      tags: locale === 'fa' ? ['پروژه', 'تحقیق', 'تیم'] : ['Project', 'Research', 'Team']
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: locale === 'fa' ? 'رویدادهای علمی' : 'Scientific Events',
      description: locale === 'fa'
        ? 'برگزاری سمینارها، کنفرانس‌ها و رویدادهای علمی'
        : 'Organizing seminars, conferences, and scientific events',
      tags: locale === 'fa' ? ['سمینار', 'کنفرانس', 'علمی'] : ['Seminar', 'Conference', 'Scientific']
    }
  ];

  return (
    <Box id="activities" sx={{ mt: { xs: 8, md: 12 }, position: 'relative' }}>
      {/* PixelBlast Background */}
      <PixelBlast
        variant="circle"
        pixelSize={4}
        color="#7df9ff"
        patternScale={2.5}
        patternDensity={0.5}
        pixelSizeJitter={0.3}
        enableRipples
        rippleSpeed={0.3}
        rippleThickness={0.15}
        rippleIntensityScale={1.2}
        liquid
        liquidStrength={0.08}
        liquidRadius={1.0}
        liquidWobbleSpeed={4}
        speed={0.5}
        edgeFade={0.3}
        transparent={false}
      />
      
      <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main' }}>
          {locale === 'fa' ? 'فعالیت‌های دانشجویی' : 'Student Activities'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', lineHeight: 1.6 }}>
          {locale === 'fa' 
            ? 'انواع فعالیت‌های علمی، پژوهشی و تفریحی برای دانشجویان مهندسی کامپیوتر'
            : 'Various scientific, research, and recreational activities for computer engineering students'
          }
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {activities.map((activity, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <ElectricBorder
              color={index === 0 ? "#7df9ff" : index === 1 ? "#ff6b6b" : index === 2 ? "#4ecdc4" : "#96ceb4"}
              speed={1.2}
              chaos={0.4}
              thickness={2}
              style={{ borderRadius: 12 }}
            >
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
                    {activity.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {activity.description}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                    {activity.tags.map((tag, tagIndex) => (
                      <Chip 
                        key={tagIndex} 
                        label={tag} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </ElectricBorder>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
