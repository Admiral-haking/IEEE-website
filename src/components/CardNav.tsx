"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface CardNavLink {
  label: string;
  ariaLabel?: string;
  href?: string;
  onClick?: () => void;
}

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items: CardNavItem[];
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ease?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CardNav({
  logo,
  logoAlt = "Logo",
  items,
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ease = "power3.out",
  className = "",
  style = {}
}: CardNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, items.length);
  }, [items.length]);

  const handleItemClick = (index: number) => {
    if (activeItem === index) {
      setActiveItem(null);
      setIsOpen(false);
    } else {
      setActiveItem(index);
      setIsOpen(true);
    }
  };

  const handleItemHover = (index: number) => {
    setHoveredItem(index);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const handleLinkClick = (link: CardNavLink) => {
    if (link.onClick) {
      link.onClick();
    }
    setActiveItem(null);
    setIsOpen(false);
  };

  const closeMenu = () => {
    setActiveItem(null);
    setIsOpen(false);
  };

  return (
    <Box
      ref={navRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: baseColor,
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Header */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        {/* Logo */}
        {logo && (
          <Box
            component="img"
            src={logo}
            alt={logoAlt}
            style={{
              height: '40px',
              width: 'auto',
              filter: 'invert(1)'
            }}
          />
        )}

        {/* Menu Button */}
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          style={{
            color: menuColor,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: '2rem',
          zIndex: 50
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            ref={(el: any) => cardRefs.current[index] = el}
            style={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleItemClick(index)}
            onMouseEnter={() => handleItemHover(index)}
            onMouseLeave={handleItemLeave}
          >
            {/* Card */}
            <Box
              style={{
                width: '200px',
                height: '300px',
                backgroundColor: item.bgColor,
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transform: hoveredItem === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: hoveredItem === index 
                  ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 20px rgba(0, 0, 0, 0.1)',
                border: activeItem === index ? '2px solid #fff' : 'none'
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: item.textColor,
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                {item.label}
              </Typography>
              
              {/* Links */}
              <Stack spacing={1} style={{ width: '100%' }}>
                {item.links.map((link, linkIndex) => (
                  <Button
                    key={linkIndex}
                    variant="text"
                    style={{
                      color: item.textColor,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      opacity: 0.8,
                      transition: 'all 0.2s ease'
                    }}
                     onClick={(e: any) => {
                      e.stopPropagation();
                      handleLinkClick(link);
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Overlay */}
      {isOpen && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(5px)'
          }}
          onClick={closeMenu}
        />
      )}

      {/* Background Pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.2) 0%, transparent 50%)
          `,
          zIndex: 1
        }}
      />
    </Box>
  );
}
