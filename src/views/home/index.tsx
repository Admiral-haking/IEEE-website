import React from 'react';
import { Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';
import StatsBand from './components/StatsBand';
type CommonDict = typeof enCommon;

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
  const dict: Partial<CommonDict> = (locale === 'fa' ? (faCommon as Partial<CommonDict>) : enCommon);
  const stats = [
  { value: '150+', label: (dict?.stats_projects ?? enCommon.stats_projects) },
  { value: '25+', label: (dict?.stats_blog_posts ?? enCommon.stats_blog_posts) },
  { value: '12+', label: (dict?.stats_case_studies ?? enCommon.stats_case_studies) },
  { value: '8+', label: (dict?.stats_jobs ?? enCommon.stats_jobs) }
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
