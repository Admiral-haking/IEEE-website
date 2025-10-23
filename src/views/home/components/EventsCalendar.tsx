"use client";

import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Chip, Button } from '@mui/material';
import { usePathname } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import PixelBlast from '@/components/PixelBlast';

export default function EventsCalendar() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';

  const upcomingEvents = [
    {
      id: 1,
      title: locale === 'fa' ? 'کارگاه برنامه‌نویسی Python' : 'Python Programming Workshop',
      date: '2024-02-15',
      time: '14:00',
      type: locale === 'fa' ? 'کارگاه' : 'Workshop',
      icon: <CodeIcon sx={{ color: 'primary.main' }} />,
      description: locale === 'fa' ? 'آموزش مقدماتی تا پیشرفته Python' : 'From basics to advanced Python programming'
    },
    {
      id: 2,
      title: locale === 'fa' ? 'سمینار هوش مصنوعی' : 'Artificial Intelligence Seminar',
      date: '2024-02-20',
      time: '16:00',
      type: locale === 'fa' ? 'سمینار' : 'Seminar',
      icon: <SchoolIcon sx={{ color: 'primary.main' }} />,
      description: locale === 'fa' ? 'آخرین پیشرفت‌ها در زمینه AI' : 'Latest developments in AI field'
    },
    {
      id: 3,
      title: locale === 'fa' ? 'مسابقه برنامه‌نویسی ACM' : 'ACM Programming Contest',
      date: '2024-02-25',
      time: '09:00',
      type: locale === 'fa' ? 'مسابقه' : 'Contest',
      icon: <EventIcon sx={{ color: 'primary.main' }} />,
      description: locale === 'fa' ? 'مسابقه برنامه‌نویسی دانشگاهی' : 'University programming competition'
    },
    {
      id: 4,
      title: locale === 'fa' ? 'کنفرانس امنیت سایبری' : 'Cybersecurity Conference',
      date: '2024-03-01',
      time: '10:00',
      type: locale === 'fa' ? 'کنفرانس' : 'Conference',
      icon: <CalendarTodayIcon sx={{ color: 'primary.main' }} />,
      description: locale === 'fa' ? 'مباحث امنیت شبکه و اطلاعات' : 'Network and information security topics'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'کارگاه':
      case 'Workshop':
        return 'success';
      case 'سمینار':
      case 'Seminar':
        return 'info';
      case 'مسابقه':
      case 'Contest':
        return 'warning';
      case 'کنفرانس':
      case 'Conference':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Box id="events" sx={{ mt: { xs: 8, md: 12 }, position: 'relative' }}>
      {/* PixelBlast Background */}
      <PixelBlast
        variant="circle"
        pixelSize={5}
        color="#4ecdc4"
        patternScale={2.8}
        patternDensity={0.7}
        pixelSizeJitter={0.4}
        enableRipples
        rippleSpeed={0.35}
        rippleThickness={0.13}
        rippleIntensityScale={1.3}
        liquid
        liquidStrength={0.10}
        liquidRadius={1.1}
        liquidWobbleSpeed={4.5}
        speed={0.55}
        edgeFade={0.28}
        transparent={false}
      />
      
      <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main' }}>
          {locale === 'fa' ? 'تقویم رویدادها' : 'Events Calendar'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', lineHeight: 1.6 }}>
          {locale === 'fa' 
            ? 'رویدادها و فعالیت‌های پیش‌روی انجمن علمی مهندسی کامپیوتر'
            : 'Upcoming events and activities of the Computer Engineering Scientific Association'
          }
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {upcomingEvents.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={3}>
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
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {event.icon}
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={getEventTypeColor(event.type) as any}
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main', lineHeight: 1.3 }}>
                    {event.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {event.description}
                  </Typography>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} color="primary.main">
                      {event.time}
                    </Typography>
                  </Stack>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {locale === 'fa' ? 'جزئیات بیشتر' : 'More Details'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ px: 4 }}
        >
          {locale === 'fa' ? 'مشاهده همه رویدادها' : 'View All Events'}
        </Button>
      </Stack>
    </Box>
  );
}
