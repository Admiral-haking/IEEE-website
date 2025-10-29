import React from 'react';
import { Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';
import StatsBand from './components/StatsBand';

// Lazy load non-critical components for better performance
const SolutionsGrid = dynamic(() => import('./components/SolutionsGrid'), { 
  loading: () => <div>Loading...</div> 
});
const CapabilitiesSection = dynamic(() => import('./components/CapabilitiesSection'), { 
  loading: () => <div>Loading...</div> 
});
const MembershipSection = dynamic(() => import('./components/MembershipSection'), { 
  loading: () => <div>Loading...</div> 
});
const StudentActivities = dynamic(() => import('./components/StudentActivities'), { 
  loading: () => <div>Loading...</div> 
});
const EventsCalendar = dynamic(() => import('./components/EventsCalendar'), { 
  loading: () => <div>Loading...</div> 
});
const NewsAndAchievements = dynamic(() => import('./components/NewsAndAchievements'), { 
  loading: () => <div>Loading...</div> 
});

export default function HomeView() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';
  const dict = (locale === 'fa' ? (faCommon as any) : (enCommon as any));
  const stats = [
    { value: '150+', label: locale === 'fa' ? 'دانشجویان عضو' : 'Student Members' },
    { value: '25+', label: locale === 'fa' ? 'پروژه‌های پژوهشی' : 'Research Projects' },
    { value: '12+', label: locale === 'fa' ? 'مقالات علمی' : 'Scientific Papers' },
    { value: '8+', label: locale === 'fa' ? 'سال فعالیت' : 'Years Active' }
  ];

  return (
    <>
      <Hero locale={locale as 'en' | 'fa'} dict={dict} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <StatsBand stats={stats} />
        <SolutionsGrid />
        <StudentActivities />
        <EventsCalendar />
        <NewsAndAchievements />
        <CapabilitiesSection />
        <MembershipSection />
      </Container>
    </>
  );
}
