'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  Analytics,
  Settings,
  Dashboard,
  School,
  HelpOutline,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const navItems = [
  { icon: <Home />, label: 'Home', href: '/home' },
  { icon: <Dashboard />, label: 'Dashboard', href: '/dashboard' },
  { icon: <School />, label: 'Decks', href: '/decks' },
  { icon: <Analytics />, label: 'Analytics', href: '/analytics' },
  { icon: <HelpOutline />, label: 'Help Center', href: '/help' },
  { icon: <Settings />, label: 'Settings', href: '/settings' },
];

const SidebarContent = ({ currentPath, onClickItem }: { currentPath: string, onClickItem?: () => void }) => (
  <Box
    sx={{
      width: 280,
      height: '100%',
      bgcolor: 'rgba(255 255 255 / 0.05)',
      backdropFilter: 'blur(12px)',
      px: 3,
      py: 6,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 5,
        userSelect: 'none',
      }}
    >
      <svg
        className="h-9 w-9 text-indigo-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
      <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
        FlashDecks
      </Typography>
    </Box>

    <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.2)' }} />

    <List sx={{ flexGrow: 1 }}>
      {navItems.map(({ icon, label, href }) => {
        const isActive = currentPath === href || currentPath.startsWith(href + '/');

        return (
          <Link key={label} href={href} passHref>
            <ListItemButton
              selected={isActive}
              onClick={onClickItem}
              sx={{
                color: isActive ? '#90caf9' : 'rgba(255 255 255 / 0.8)',
                bgcolor: isActive ? 'rgba(144, 202, 249, 0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255 255 255 / 0.2)',
                },
                mb: 0.5,
                borderRadius: 1,
                transition: 'background-color 0.3s, color 0.3s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </Link>
        );
      })}
    </List>

    <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.2)', my: 3 }} />

    <Typography
      variant="body2"
      sx={{
        color: 'rgba(255 255 255 / 0.6)',
        userSelect: 'none',
        fontStyle: 'italic',
      }}
    >
      For the love of my life..
    </Typography>
  </Box>
);

const UnifiedSidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || '/';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Menu Button on Mobile */}
{isMobile && !mobileOpen && (
  <Box
    sx={{
      p: 2,
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1300,
    }}
  >
    <IconButton
      onClick={toggleDrawer}
      aria-label="Open menu"
      sx={{
        color: '#555 !important', 
      }}
    >
      <MenuIcon sx={{ color: '#555 !important' }} />
    </IconButton>
  </Box>
)}


      {/* Permanent Sidebar on Desktop */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            borderRight: '1px solid rgba(255 255 255 / 0.15)',
          }}
        >
          <SidebarContent currentPath={pathname} />
        </Box>
      )}

      {/* Drawer Sidebar on Mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(255 255 255 / 0.05)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            width: 280,
          },
        }}
      >
        <SidebarContent currentPath={pathname} onClickItem={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default UnifiedSidebar;