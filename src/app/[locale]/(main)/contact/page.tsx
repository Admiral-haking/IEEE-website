"use client";

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Link, 
  Paper, 
  Divider, 
  TextField, 
  Button, 
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
  Grid2 as Grid,
  IconButton,
  Snackbar
} from '@mui/material';
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

export default function ContactPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pt: { xs: 8, md: 10 },
      pb: { xs: 6, md: 8 }
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: 'white',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {t('contact_us')}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
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
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
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
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
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
                              href={`tel:${contactInfo.phone}`}
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
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1), rgba(102, 126, 234, 0.1))',
                          border: '1px solid rgba(118, 75, 162, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(118, 75, 162, 0.2)'
                          }
                        }}
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
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
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
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
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
                        href={`https://t.me/${contactInfo.telegram}`}
                        target="_blank"
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
                        href={`https://linkedin.com/company/${contactInfo.linkedin}`}
                        target="_blank"
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
                        href={`https://instagram.com/${contactInfo.instagram}`}
                        target="_blank"
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