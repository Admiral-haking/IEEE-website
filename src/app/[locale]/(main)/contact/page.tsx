import React from 'react';
import mongooseConn from '@/lib/mongoose';
import StaticPage from '@/models/StaticPage';
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
  useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

export default async function ContactPage({ params }: { params: Promise<{ locale: 'en' | 'fa' }> }) {
  const { locale } = await params;
  // Ensure DB connection is established before querying
  await mongooseConn;
  const page = await StaticPage.findOne({ key: 'contact', locale }).lean();
  const contact = (page?.contact || {}) as any;
  const dict = locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pt: { xs: 10, md: 14 },
      pb: { xs: 6, md: 10 }
    }}>
      <Container maxWidth="lg">
        {/* Enhanced Hero Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: { xs: 3, md: 4 },
              mb: { xs: 4, md: 6 },
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          >
            <Stack gap={3} alignItems="center" textAlign="center">
              <Typography 
                variant="overline" 
                color="primary.main" 
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 600,
                  letterSpacing: 2
                }}
              >
                {dict.contact_overline}
              </Typography>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  letterSpacing: -0.5,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {dict.contact}
              </Typography>
              <Typography 
                color="text.secondary" 
                maxWidth={800}
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.6
                }}
              >
                {dict.contact_intro}
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 2 }}
              >
                {contact.phone && (
                  <Chip 
                    icon={<PhoneIcon />} 
                    label={contact.phone} 
                    variant="outlined" 
                    sx={{ 
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      '&:hover': { backgroundColor: 'primary.50' }
                    }} 
                  />
                )}
                {contact.email && (
                  <Chip 
                    icon={<EmailIcon />} 
                    label={contact.email} 
                    variant="outlined" 
                    sx={{ 
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      '&:hover': { backgroundColor: 'primary.50' }
                    }} 
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Enhanced Contact Form */}
          <Grid xs={12} lg={7}>
            <Fade in timeout={1000}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: { xs: 3, md: 4 },
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Stack gap={3}>
                    <Box>
                      <Typography 
                        variant="h4" 
                        fontWeight={600} 
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: '1.4rem', md: '1.75rem' },
                          color: 'text.primary',
                          fontFamily: 'inherit',
                          lineHeight: 1.3
                        }}
                      >
                        {dict.send_message}
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          lineHeight: 1.6,
                          fontFamily: 'inherit',
                          mt: 1
                        }}
                      >
                        {dict.prefer_email_detail}
                      </Typography>
                    </Box>

                    <Box 
                      component="form" 
                      action={contact.email ? `mailto:${contact.email}` : undefined} 
                      method="post" 
                      encType="text/plain"
                      sx={{ mt: 3 }}
                    >
                      <Grid container spacing={2.5}>
                        <Grid xs={12} sm={6}>
                          <TextField 
                            label={dict.name_label} 
                            name="name" 
                            required 
                            fullWidth 
                            variant="outlined"
                            size="medium"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '1rem',
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.12)',
                                  borderWidth: 1
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2
                                }
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.95rem',
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                  color: 'primary.main'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '1rem',
                                padding: '14px 14px 14px 0',
                                fontFamily: 'inherit'
                              }
                            }}
                          />
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <TextField 
                            label={dict.email_label} 
                            name="email" 
                            type="email" 
                            required 
                            fullWidth 
                            variant="outlined"
                            size="medium"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '1rem',
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.12)',
                                  borderWidth: 1
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2
                                }
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.95rem',
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                  color: 'primary.main'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '1rem',
                                padding: '14px 14px 14px 0',
                                fontFamily: 'inherit'
                              }
                            }}
                          />
                        </Grid>
                        <Grid xs={12}>
                          <TextField 
                            label={dict.subject_label} 
                            name="subject" 
                            fullWidth 
                            variant="outlined"
                            size="medium"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SubjectIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '1rem',
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.12)',
                                  borderWidth: 1
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2
                                }
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.95rem',
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                  color: 'primary.main'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '1rem',
                                padding: '14px 14px 14px 0',
                                fontFamily: 'inherit'
                              }
                            }}
                          />
                        </Grid>
                        <Grid xs={12}>
                          <TextField 
                            label={dict.message_label} 
                            name="message" 
                            multiline 
                            minRows={5} 
                            fullWidth 
                            variant="outlined"
                            size="medium"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                  <MessageIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '1rem',
                                '& fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.12)',
                                  borderWidth: 1
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2
                                }
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.95rem',
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                  color: 'primary.main'
                                }
                              },
                              '& .MuiInputBase-input': {
                                fontSize: '1rem',
                                padding: '14px 14px 14px 0',
                                fontFamily: 'inherit',
                                lineHeight: 1.5
                              }
                            }}
                          />
                        </Grid>
                        <Grid xs={12}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2}
                            sx={{ mt: 3 }}
                          >
                            <Button 
                              type="submit" 
                              variant="contained" 
                              color="primary"
                              size="large"
                              startIcon={<SendIcon sx={{ fontSize: '1.1rem' }} />}
                              sx={{ 
                                px: 3,
                                py: 1.2,
                                borderRadius: 1.5,
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                fontFamily: 'inherit',
                                backgroundColor: 'primary.main',
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                  transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              {dict.send}
                            </Button>
                            {contact.email && (
                              <Button 
                                variant="outlined" 
                                href={`mailto:${contact.email}`}
                                size="large"
                                sx={{ 
                                  px: 3,
                                  py: 1.2,
                                  borderRadius: 1.5,
                                  fontSize: '0.95rem',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  fontFamily: 'inherit',
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  borderWidth: 1.5,
                                  '&:hover': {
                                    backgroundColor: 'primary.50',
                                    borderColor: 'primary.dark',
                                    borderWidth: 1.5,
                                    transform: 'translateY(-1px)'
                                  },
                                  transition: 'all 0.2s ease-in-out'
                                }}
                              >
                                {dict.email_us}
                              </Button>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>

                    {page?.contentHtml && (
                      <>
                        <Divider sx={{ my: 4 }} />
                        <Box 
                          sx={{ 
                            '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2 },
                            '& p': { lineHeight: 1.7 },
                            '& h1, & h2, & h3, & h4, & h5, & h6': { color: 'primary.main' }
                          }} 
                          dangerouslySetInnerHTML={{ __html: page?.contentHtml || '' }} 
                        />
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Enhanced Contact Information */}
          <Grid xs={12} lg={5}>
            <Stack gap={{ xs: 3, md: 4 }}>
              <Fade in timeout={1200}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: { xs: 3, md: 4 },
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                    <Typography 
                      variant="h5" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '1.2rem', md: '1.4rem' },
                        color: 'text.primary',
                        fontFamily: 'inherit',
                        lineHeight: 1.3,
                        mb: 3
                      }}
                    >
                      Ø§Ø·Ù„Ø§Ø¹Ø§Øª ØªÙ…Ø§Ø³
                    </Typography>
                    <Stack gap={3}>
                      {contact.phone && (
                        <Box 
                          sx={{ 
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            border: '1px solid rgba(102, 126, 234, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <PhoneIcon />
                            </Box>
                            <Box>
                              <Typography 
                                variant="subtitle2" 
                                color="primary.main" 
                                fontWeight={500}
                                sx={{ 
                                  fontSize: '0.85rem',
                                  fontFamily: 'inherit',
                                  mb: 0.5
                                }}
                              >
                                {dict.phone_label}
                              </Typography>
                              <Typography 
                                component={Link} 
                                href={`tel:${contact.phone}`}
                                sx={{ 
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                  fontFamily: 'inherit',
                                  '&:hover': { color: 'primary.main' }
                                }}
                              >
                                {contact.phone}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                      
                      {contact.email && (
                        <Box 
                          sx={{ 
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(118, 75, 162, 0.05)',
                            border: '1px solid rgba(118, 75, 162, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(118, 75, 162, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 15px rgba(118, 75, 162, 0.1)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'secondary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <EmailIcon />
                            </Box>
                            <Box>
                              <Typography 
                                variant="subtitle2" 
                                color="secondary.main" 
                                fontWeight={500}
                                sx={{ 
                                  fontSize: '0.85rem',
                                  fontFamily: 'inherit',
                                  mb: 0.5
                                }}
                              >
                                {dict.email_label}
                              </Typography>
                              <Typography 
                                component={Link} 
                                href={`mailto:${contact.email}`}
                                sx={{ 
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                  fontFamily: 'inherit',
                                  '&:hover': { color: 'secondary.main' }
                                }}
                              >
                                {contact.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                      
                      {contact.address && (
                        <Box 
                          sx={{ 
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(25, 118, 210, 0.05)',
                            border: '1px solid rgba(25, 118, 210, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.1)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'info.main',
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
                              <Typography 
                                variant="subtitle2" 
                                color="info.main" 
                                fontWeight={500}
                                sx={{ 
                                  fontSize: '0.85rem',
                                  fontFamily: 'inherit',
                                  mb: 0.5
                                }}
                              >
                                {dict.address_label}
                              </Typography>
                              <Typography 
                                sx={{ 
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                  fontFamily: 'inherit',
                                  lineHeight: 1.6
                                }}
                              >
                                {contact.address}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                      
                      {contact.openingHours && (
                        <Box 
                          sx={{ 
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'rgba(76, 175, 80, 0.05)',
                            border: '1px solid rgba(76, 175, 80, 0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.1)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box 
                              sx={{ 
                                p: 1.5,
                                borderRadius: '50%',
                                backgroundColor: 'success.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <AccessTimeIcon />
                            </Box>
                            <Box>
                              <Typography 
                                variant="subtitle2" 
                                color="success.main" 
                                fontWeight={500}
                                sx={{ 
                                  fontSize: '0.85rem',
                                  fontFamily: 'inherit',
                                  mb: 0.5
                                }}
                              >
                                {dict.opening_hours_label}
                              </Typography>
                              <Typography 
                                sx={{ 
                                  color: 'text.primary',
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                  fontFamily: 'inherit'
                                }}
                              >
                                {contact.openingHours}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>

              {contact.mapEmbedUrl && (
                <Fade in timeout={1400}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      borderRadius: { xs: 3, md: 4 },
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Box sx={{ p: 1 }}>
                      <Box 
                        sx={{ 
                          overflow: 'hidden', 
                          borderRadius: 2,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                      >
                        <iframe 
                          title="map" 
                          src={contact.mapEmbedUrl} 
                          style={{ 
                            width: '100%', 
                            height: 'min(60vh, 420px)', 
                            border: 0,
                            borderRadius: 8
                          }} 
                          loading="lazy" 
                          allowFullScreen 
                        />
                      </Box>
                    </Box>
                  </Card>
                </Fade>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa' }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
  return buildListMetadata({ locale, path: '/contact', title: dict.contact, description: dict.contact_intro });
}

