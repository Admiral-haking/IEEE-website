"use client";

import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, Paper, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { usePathname } from 'next/navigation';

const wrapperSx: SystemStyleObject<Theme> = {
  position: 'relative',
  width: '100%',
  maxWidth: { xs: 260, sm: 340, md: 420 }
};

const textFieldSx = (isRtl: boolean): SystemStyleObject<Theme> => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    backgroundColor: 'background.paper',
    height: { xs: 36, sm: 40, md: 44 } as const,
    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' } as const,
    direction: isRtl ? 'rtl' : 'ltr',
    '& input': {
      textAlign: isRtl ? 'right' : 'left',
      fontFamily: isRtl ? 'var(--font-body-fa)' : 'var(--font-body-en)'
    },
    '&:hover': {
      backgroundColor: 'background.paper',
    },
    '&.Mui-focused': {
      backgroundColor: 'background.paper',
    },
  },
});

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'fa';
  const isRtl = locale === 'fa';
  const placeholderText = isRtl ? 'O?O3O?O?U^ O_O? O3OUOO?...' : 'Search the site...';
  const searchAriaLabel = isRtl ? 'O?O3O?O?U^ O_O? O3OUOO?' : 'Search the site';
  const clearAriaLabel = isRtl ? 'U_OUc UcO?O_U+ O?O3O?O?U^' : 'Clear search';

  const suggestions = [
    { text: locale === 'fa' ? 'کارگاه برنامه‌نویسی' : 'Programming Workshop', type: 'event' },
    { text: locale === 'fa' ? 'مسابقه ACM' : 'ACM Contest', type: 'event' },
    { text: locale === 'fa' ? 'مقالات علمی' : 'Scientific Papers', type: 'publication' },
    { text: locale === 'fa' ? 'عضویت در انجمن' : 'Association Membership', type: 'membership' },
    { text: locale === 'fa' ? 'پروژه‌های پژوهشی' : 'Research Projects', type: 'project' },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    // Here you would implement actual search functionality
    console.log('Searching for:', term);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <Box sx={wrapperSx}>
      <TextField
        fullWidth
        placeholder={placeholderText}
        inputProps={{
          name: 'navbar-search',
          'aria-label': searchAriaLabel
        }}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch(searchTerm);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch} size="small" aria-label={clearAriaLabel}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={textFieldSx(isRtl)}
      />
      
      {showSuggestions && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            maxHeight: 200,
            overflow: 'auto',
            boxShadow: 3,
          }}
        >
          <List dense>
            {suggestions
              .filter(suggestion => 
                suggestion.text.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((suggestion, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleSearch(suggestion.text)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    px: 1.5
                  }}
                >
                  <ListItemText
                    primary={suggestion.text}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {locale === 'fa' 
                          ? `نوع: ${suggestion.type === 'event' ? 'رویداد' : 
                              suggestion.type === 'publication' ? 'انتشارات' :
                              suggestion.type === 'membership' ? 'عضویت' : 'پروژه'}`
                          : `Type: ${suggestion.type}`
                        }
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
