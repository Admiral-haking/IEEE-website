// @ts-nocheck
"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Link,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Fade,
  IconButton,
  Snackbar
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useTranslation } from 'react-i18next';

const heroSectionSx = (theme: Theme): SystemStyleObject<Theme> => ({
  position: 'relative',
  minHeight: '100dvh',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(10)
  },
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  color: '#ffffff',
  backgroundImage: 'linear-gradient(160deg, rgba(9, 12, 51, 0.52) 0%, rgba(4, 2, 36, 0.72) 55%, rgba(0, 0, 0, 0.58) 100%), linear-gradient(135deg, #5966d8 0%, #5b3996 100%)',
  backgroundBlendMode: 'overlay',
  boxShadow: 'inset 0 -120px 160px rgba(2, 6, 23, 0.45)',
  '& > *': {
    position: 'relative',
    zIndex: 1
  }
});

const heroTitleSx: SystemStyleObject<Theme> = {
  fontSize: { xs: '2.75rem', md: '4rem' },
  fontWeight: 800,
  color: '#ffffff',
  mb: 3,
  px: { xs: 2, md: 3 },
  py: { xs: 1, md: 1.5 },
  borderRadius: 3,
  display: 'inline-block',
  backgroundColor: 'rgba(4, 8, 28, 0.45)',
  boxShadow: '0 24px 55px rgba(2, 6, 23, 0.4)',
  backdropFilter: 'blur(6px)',
  textShadow: '0 10px 28px rgba(0, 0, 0, 0.55)'
};

const heroSubtitleSx: SystemStyleObject<Theme> = {
  color: 'rgba(255, 255, 255, 0.95)',
  fontWeight: 500,
  maxWidth: 680,
  mx: 'auto',
  px: { xs: 2, md: 3 },
  py: { xs: 1, md: 1.25 },
  borderRadius: 3,
  backgroundColor: 'rgba(4, 8, 28, 0.38)',
  boxShadow: '0 18px 45px rgba(2, 6, 23, 0.32)',
  textShadow: '0 5px 22px rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(5px)'
};

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({ open: true, message: t('message_sent_successfully'), severity: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSnackbar({ open: true, message: t('message_send_failed'), severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = {
    phone: '+98 21 1234 5678',
    email: 'info@ieee-university.ac.ir',
    address: 'دانشگاه تهران، پردیس دانشکده فنی، انجمن علمی مهندسی کامپیوتر',
    openingHours: 'شنبه تا چهارشنبه: 8:00 - 16:00',
    whatsapp: '+98 912 345 6789',
    telegram: '@ieee_computer',
    linkedin: 'ieee-computer-society',
    instagram: '@ieee_computer'
  };

  const sanitizedPhone = contactInfo.phone.replace(/\s+/g, '');
  const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, '');
  const telegramHandle = contactInfo.telegram.replace(/^@/, '');
  const instagramHandle = contactInfo.instagram.replace(/^@/, '');

  return (
    <Box sx={heroSectionSx}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="h1"
              sx={heroTitleSx}
            >
              {t('contact_us')}
            </Typography>
            <Typography
              variant="h5"
              sx={heroSubtitleSx}
            >
              {t('contact_intro')}
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid xs={12} lg={7}>
            <Fade in timeout={800}>
              <Card 
                elevation={8}
                sx={(theme) => ({ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(17, 25, 40, 0.6)'
                    : 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'saturate(140%) blur(10px)',
                  WebkitBackdropFilter: 'saturate(140%) blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'}`
                })}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={700}
                    sx={{ 
                      mb: 3,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {t('send_message')}
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid xs={12} sm={6}>
                        <TextField 
                          label={t('name')}
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                          fullWidth 
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#667eea'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <TextField 
                          label={t('email')}
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email" 
                          required 
                          fullWidth 
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#667eea'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField 
                          label={t('subject')}
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          fullWidth 
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon color="primary" />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#667eea'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <TextField 
                          label={t('message')}
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          multiline 
                          rows={5}
                          fullWidth 
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                <MessageIcon color="primary" />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#667eea'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid xs={12}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          size="large"
                          disabled={isSubmitting}
                          startIcon={<SendIcon />}
                          sx={{ 
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {isSubmitting ? t('sending') : t('send')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Contact Information */}
          <Grid xs={12} lg={5}>
            <Stack spacing={3}>
              {/* Contact Details */}
              <Fade in timeout={1000}>
                <Card 
                  elevation={8}
                  sx={(theme) => ({ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(17, 25, 40, 0.6)'
                      : 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'saturate(140%) blur(10px)',
                    WebkitBackdropFilter: 'saturate(140%) blur(10px)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'}`
                  })}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={700}
                      sx={{ 
                        mb: 3,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {t('contact_info')}
                    </Typography>

                    <Stack spacing={3}>
                      {/* Phone */}
                      <Box 
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                          }
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              p: 1.5,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <PhoneIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mb: 0.5 }}>
                              {t('phone')}
                            </Typography>
                            <Link 
                              href={`tel:${sanitizedPhone}`}
                              sx={{ 
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: '1rem',
                                fontWeight: 500,
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {contactInfo.phone}
                            </Link>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Email */}
                      <Box 
                        sx={(theme) => ({ 
                          p: 3,
                          borderRadius: 2,
                          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)'
                          }
                        })}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              p: 1.5,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #764ba2, #667eea)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <EmailIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                              {t('email')}
                            </Typography>
                            <Link 
                              href={`mailto:${contactInfo.email}`}
                              sx={{ 
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: '1rem',
                                fontWeight: 500,
                                '&:hover': { color: 'secondary.main' }
                              }}
                            >
                              {contactInfo.email}
                            </Link>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Address */}
                      <Box 
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(102, 126, 234, 0.1))',
                          border: '1px solid rgba(25, 118, 210, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.2)'
                          }
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box 
                            sx={{ 
                              p: 1.5,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #1976d2, #667eea)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5
                            }}
                          >
                            <LocationOnIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="info" fontWeight={600} sx={{ mb: 0.5 }}>
                              {t('address')}
                            </Typography>
                            <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
                              {contactInfo.address}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Hours */}
                      <Box 
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(102, 126, 234, 0.1))',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)'
                          }
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              p: 1.5,
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #4caf50, #667eea)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <AccessTimeIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" color="success" fontWeight={600} sx={{ mb: 0.5 }}>
                              {t('opening_hours')}
                            </Typography>
                            <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 500 }}>
                              {contactInfo.openingHours}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>

              {/* Social Media */}
              <Fade in timeout={1200}>
                <Card 
                  elevation={8}
                  sx={(theme) => ({ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(17, 25, 40, 0.6)'
                      : 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'saturate(140%) blur(10px)',
                    WebkitBackdropFilter: 'saturate(140%) blur(10px)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'}`
                  })}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700}
                      sx={{ 
                        mb: 3,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {t('follow_us')}
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                      <IconButton 
                        component="a"
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        sx={{ 
                          p: 2,
                          background: 'linear-gradient(45deg, #25D366, #128C7E)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #20BA5A, #0F7A6B)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                      <IconButton 
                        component="a"
                        href={`https://t.me/${telegramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                        sx={{ 
                          p: 2,
                          background: 'linear-gradient(45deg, #0088cc, #667eea)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #0077B5, #5a6fd8)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <TelegramIcon />
                      </IconButton>
                      <IconButton 
                        component="a"
                        href={`https://linkedin.com/company/${contactInfo.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        sx={{ 
                          p: 2,
                          background: 'linear-gradient(45deg, #0077B5, #667eea)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #005885, #5a6fd8)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                      <IconButton 
                        component="a"
                        href={`https://instagram.com/${instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        sx={{ 
                          p: 2,
                          background: 'linear-gradient(45deg, #E4405F, #667eea)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #D62976, #5a6fd8)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <InstagramIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
