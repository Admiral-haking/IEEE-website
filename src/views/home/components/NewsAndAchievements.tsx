"use client";

import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Chip, Avatar } from '@mui/material';
import { usePathname } from 'next/navigation';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import GradualBlur from '@/components/GradualBlur';

export default function NewsAndAchievements() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';

  const newsItems = [
    {
      id: 1,
      title: locale === 'fa' ? 'رتبه اول در مسابقه برنامه‌نویسی کشوری' : 'First Place in National Programming Contest',
      type: 'achievement',
      icon: <EmojiEventsIcon sx={{ color: '#FFD700' }} />,
      date: '2024-01-15',
      description: locale === 'fa' 
        ? 'تیم انجمن علمی در مسابقه برنامه‌نویسی کشوری رتبه اول را کسب کرد'
        : 'Association team won first place in the national programming contest',
      category: locale === 'fa' ? 'دستاورد' : 'Achievement'
    },
    {
      id: 2,
      title: locale === 'fa' ? 'انتشار مقاله در کنفرانس بین‌المللی' : 'Paper Published in International Conference',
      type: 'news',
      icon: <ArticleIcon sx={{ color: 'primary.main' }} />,
      date: '2024-01-10',
      description: locale === 'fa' 
        ? 'مقاله اعضای انجمن در کنفرانس بین‌المللی IEEE منتشر شد'
        : 'Association members\' paper was published in IEEE international conference',
      category: locale === 'fa' ? 'انتشارات' : 'Publications'
    },
    {
      id: 3,
      title: locale === 'fa' ? 'راه‌اندازی آزمایشگاه هوش مصنوعی' : 'AI Laboratory Launch',
      type: 'news',
      icon: <SchoolIcon sx={{ color: 'success.main' }} />,
      date: '2024-01-05',
      description: locale === 'fa' 
        ? 'آزمایشگاه جدید هوش مصنوعی در دانشگاه راه‌اندازی شد'
        : 'New AI laboratory was launched at the university',
      category: locale === 'fa' ? 'تجهیزات' : 'Facilities'
    },
    {
      id: 4,
      title: locale === 'fa' ? 'افزایش 40% اعضای انجمن' : '40% Increase in Association Members',
      type: 'achievement',
      icon: <TrendingUpIcon sx={{ color: 'info.main' }} />,
      date: '2024-01-01',
      description: locale === 'fa' 
        ? 'تعداد اعضای انجمن در سال جاری 40% افزایش یافت'
        : 'Association membership increased by 40% this year',
      category: locale === 'fa' ? 'رشد' : 'Growth'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'دستاورد':
      case 'Achievement':
        return 'warning';
      case 'انتشارات':
      case 'Publications':
        return 'primary';
      case 'تجهیزات':
      case 'Facilities':
        return 'success';
      case 'رشد':
      case 'Growth':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box id="news" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack alignItems="center" textAlign="center" spacing={2} sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'primary.main' }}>
          {locale === 'fa' ? 'اخبار و دستاوردها' : 'News & Achievements'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', lineHeight: 1.6 }}>
          {locale === 'fa' 
            ? 'آخرین اخبار، دستاوردها و موفقیت‌های انجمن علمی مهندسی کامپیوتر'
            : 'Latest news, achievements and successes of the Computer Engineering Scientific Association'
          }
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {newsItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6}>
            <Card sx={{ 
              height: '100%', 
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: 3,
                zIndex: 10
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {item.icon}
                    </Avatar>
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          color={getCategoryColor(item.category) as any}
                          variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main', lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Scrollable News Feed with GradualBlur */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'primary.main' }}>
          {locale === 'fa' ? 'خبرنامه انجمن' : 'Association Newsletter'}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            height: '300px',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              padding: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Stack spacing={3}>
              {Array.from({ length: 8 }, (_, i) => (
                <Box key={i} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {locale === 'fa' ? `خبر ${i + 1}: عنوان خبر` : `News ${i + 1}: News Title`}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {locale === 'fa' 
                      ? `این متن نمونه برای خبر ${i + 1} است که در خبرنامه انجمن علمی مهندسی کامپیوتر منتشر شده است.`
                      : `This is sample content for news item ${i + 1} published in the Computer Engineering Association newsletter.`
                    }
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <GradualBlur
            target="parent"
            position="bottom"
            height="4rem"
            strength={1.5}
            divCount={4}
            curve="bezier"
            exponential={true}
            opacity={0.8}
          />
        </Box>
      </Box>

      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {locale === 'fa' 
            ? 'برای دریافت آخرین اخبار و اطلاعیه‌ها در خبرنامه ما عضو شوید'
            : 'Subscribe to our newsletter for the latest news and announcements'
          }
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {locale === 'fa' ? 'عضویت در خبرنامه:' : 'Subscribe to newsletter:'}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={500}>
            newsletter@ce-association.ir
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
