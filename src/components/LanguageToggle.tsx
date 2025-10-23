"use client";

import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Stack,
  Typography,
  useTheme,
  Fade,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';

type Lang = 'en' | 'fa';

const options: { code: Lang; short: 'EN' | 'FA'; label: string }[] = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'fa', short: 'FA', label: '\u0641\u0627\u0631\u0633\u06CC' },
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const initial: Lang = i18n.language?.startsWith('fa') ? 'fa' : 'en';
  const [lang, setLang] = React.useState<Lang>(initial);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  React.useEffect(() => {
    if (!pathname) {
      return;
    }
    const parts = pathname.split('/').filter(Boolean);
    const pathLocale = parts[0] === 'fa' ? 'fa' : 'en';
    setLang((current) => (current === pathLocale ? current : pathLocale));
  }, [pathname]);

  const current = options.find((o) => o.code === lang)!;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const choose = (code: Lang) => {
    setLang(code);
    i18n.changeLanguage(code);
    // Rebuild path with selected locale
    let path = pathname || '/';
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) {
      path = `/${code}`;
    } else if (parts[0] === 'en' || parts[0] === 'fa') {
      parts[0] = code;
      path = `/${parts.join('/')}`;
    } else {
      path = `/${code}/${parts.join('/')}`;
    }
    router.push(path as any);
    handleClose();
  };

  return (
    <>
      <Tooltip title={lang === 'fa' ? 'Switch language' : 'ØªØºÛŒÛŒØ± Ø²Ø¨Ø§Ù†'}>
        <IconButton
          onClick={handleOpen}
          aria-haspopup="true"
          aria-controls={open ? 'lang-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          size="medium"
          sx={{ width: 44, height: 44, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
          aria-label={lang === 'fa' ? 'Change language' : 'ØªØºÛŒÛŒØ± Ø²Ø¨Ø§Ù†'}
        >
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Typography variant='caption' sx={{ fontWeight: 700 }}>{current.short}</Typography>
          </Stack>
        </IconButton>
      </Tooltip>
      <Menu
        id="lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        anchorOrigin={{ vertical: 'bottom', horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
        TransitionComponent={Fade}
        transitionDuration={200}
        slotProps={{ paper: { sx: { mt: 1.25, minWidth: 160, zIndex: (t:any) => t.zIndex.modal + 1 } } }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.code} selected={opt.code === lang} onClick={() => choose(opt.code)}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Typography variant='caption' sx={{ fontWeight: 700 }}>{opt.short}</Typography>
            </ListItemIcon>
            <ListItemText>{opt.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}








