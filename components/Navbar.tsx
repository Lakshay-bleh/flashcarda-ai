'use client';

import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Menu,
  MenuItem,
  Divider,
  Avatar,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import {
  AccountCircle,
  Insights,
  Settings,
  Logout,
  HelpOutline,
} from '@mui/icons-material';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <button
              onClick={() => {
                window.location.href = isSignedIn ? '/home' : '/';
              }}
              className="ml-2 text-xl font-bold text-gray-900"
            >
              FlashDecks
            </button>
          </div>

          {/* Navigation + User */}
          <div className="hidden sm:flex items-center space-x-6">
            {/* Home */}
            <Link
              href={isSignedIn ? '/home' : '/'}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Home
            </Link>

            {/* Conditional Links */}
            {isSignedIn ? (
              <>
                {/* Show Dashboard and Analytics */}
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/analytics"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Analytics
                </Link>
                {/* Added Help and About for logged in */}
                <Link
                  href="/help"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Help
                </Link>
              </>
            ) : (
              <>
                {/* Logged out: Hide Dashboard, Show Features, About */}
                <Link
                  href="/features"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  About
                </Link>
              </>
            )}

            {/* User Menu or Sign Up */}
            {isSignedIn ? (
              <>
                {/* Avatar Dropdown */}
                <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'indigo.600',
                      width: 40,
                      height: 40,
                      fontWeight: 600,
                    }}
                  >
                    {user?.firstName?.[0] || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      width: 220,
                    },
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    Hello, {user?.firstName || user?.username}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose} component={Link} href="/profile">
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} href="/analytics">
                    <ListItemIcon>
                      <Insights fontSize="small" />
                    </ListItemIcon>
                    Analytics
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} href="/settings">
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} href="/help">
                    <ListItemIcon>
                      <HelpOutline fontSize="small" />
                    </ListItemIcon>
                    Help
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      signOut();
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <span className="text-red-600">Sign Out</span>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                href="/sign-up"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
