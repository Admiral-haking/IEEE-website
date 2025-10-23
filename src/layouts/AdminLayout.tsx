"use client";
import React from 'react';
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('fa');

  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const nav = (
    <Box role="presentation" sx={{ width: { xs: drawerWidth, md: '100%' } }}>
      <Toolbar>
        <Typography variant="subtitle1" fontWeight={600}>{t('admin')}</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton component={NextLink} href={`/${locale}/admin`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><DashboardOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('dashboard')} secondary={t('nav_dashboard_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/users`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><PeopleAltOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('users')} secondary={t('nav_users_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/team-members`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><GroupOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('team_members')} secondary={t('nav_team_members_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/pages`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><DescriptionOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('pages')} secondary={t('nav_pages_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/solutions`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><CategoryOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('solutions')} secondary={t('nav_solutions_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/capabilities`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><AutoAwesomeOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('capabilities')} secondary={t('nav_capabilities_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/blog`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><ArticleOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('blog')} secondary={t('nav_blog_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/case-studies`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><ArticleOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('case_studies')} secondary={t('nav_case_studies_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/jobs`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><WorkOutlineOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('jobs')} secondary={t('nav_jobs_sub')} />
        </ListItemButton>
        <ListItemButton component={NextLink} href={`/${locale}/admin/media`} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
          <ListItemIcon><CollectionsOutlinedIcon /></ListItemIcon>
          <ListItemText primary={t('media')} secondary={t('nav_media_sub')} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="admin navigation">
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggle}
          ModalProps={{ keepMounted: true }}
          anchor={isRtl ? 'right' : 'left'}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {nav}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          anchor={isRtl ? 'right' : 'left'}
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {nav}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ display: { md: 'none' }, justifyContent: 'space-between' }}>
          <IconButton onClick={toggle} aria-label={t('menu') || 'menu'}><MenuIcon /></IconButton>
          <Typography variant="subtitle2">{t('admin_panel')}</Typography>
        </Toolbar>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>

    </Box>
  );
}
