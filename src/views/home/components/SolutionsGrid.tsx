"use client";

import React from 'react';
import { Grid, Paper, Stack, Typography, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import ElectricBorder from '@/components/ElectricBorder';
import PixelBlast from '@/components/PixelBlast';

const CARDS = [
  { title: 'فعالیت‌های علمی', desc: 'سازماندهی سمینارها، کنفرانس‌ها و کارگاه‌های آموزشی تخصصی' },
  { title: 'پروژه‌های پژوهشی', desc: 'انجام پروژه‌های تحقیقاتی در زمینه هوش مصنوعی، امنیت سایبری و فناوری‌های نوین' },
  { title: 'فعالیت‌های دانشجویی', desc: 'برگزاری مسابقات برنامه‌نویسی، هکاتون‌ها و رویدادهای تخصصی' }
];

export default function SolutionsGrid() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';

  return (
    <Box sx={{ mb: 6, position: 'relative' }}>
      {/* PixelBlast Background */}
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#B19EEF"
        patternScale={3}
        patternDensity={0.6}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent={false}
      />
      
      {/* Section Header */}
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            mb: 2, 
            color: 'primary.main',
            backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundSize: '200% 200%',
            '@supports (-webkit-background-clip: text)': {
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            },
            '@supports (background-clip: text)': {
              backgroundClip: 'text',
              color: 'transparent'
            }
          }}
        >
          {locale === 'fa' ? 'خدمات و راه‌حل‌ها' : 'Services & Solutions'}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          {locale === 'fa' 
            ? 'انجمن علمی مهندسی کامپیوتر با ارائه خدمات متنوع و راه‌حل‌های نوآورانه، در خدمت جامعه دانشگاهی است'
            : 'Computer Engineering Scientific Association provides diverse services and innovative solutions for the academic community'
          }
        </Typography>
      </Box>

      <Grid container spacing={3} id="solutions">
      {CARDS.map((c, index) => (
        <Grid item key={c.title} xs={12} md={4}>
          <ElectricBorder
            color={index === 0 ? "#7df9ff" : index === 1 ? "#ff6b6b" : "#4ecdc4"}
            speed={1}
            chaos={0.3}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <Paper variant="outlined" sx={{ 
              p: 3, 
              borderRadius: 3, 
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
              <Stack gap={1}>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'primary.main' }}>{c.title}</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>{c.desc}</Typography>
              </Stack>
            </Paper>
          </ElectricBorder>
        </Grid>
      ))}
      </Grid>
    </Box>
  );
}
