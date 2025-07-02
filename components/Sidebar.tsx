'use client'

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Home,
  Analytics,
  Settings,
  Dashboard,
  School,
  HelpOutline,
} from "@mui/icons-material";

const navItems = [
  { icon: <Home />, label: "Home", href: "/home" },
  { icon: <Dashboard />, label: "Dashboard", href: "/dashboard" },
  { icon: <School />, label: "Decks", href: "/decks" }, // picked School icon for Decks
  { icon: <Analytics />, label: "Analytics", href: "/analytics" },
  { icon: <HelpOutline />, label: "Help Center", href: "/help" },
  { icon: <Settings />, label: "Settings", href: "/settings" },
];

const useCurrentPath = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/";
};

const UnifiedSidebar: React.FC = () => {
  const currentPath = useCurrentPath();

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: "100%", sm: 280 },
        bgcolor: "rgba(255 255 255 / 0.05)",
        backdropFilter: "blur(12px)",
        height: "100vh",
        px: 3,
        py: 6,
        borderRight: "1px solid rgba(255 255 255 / 0.15)",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* Sidebar Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 5,
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.25rem",
            boxShadow: 1,
            color: "white",
          }}
        >
          F
        </Box>
        <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
          FlashDecks
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map(({ icon, label, href }) => {
          const isActive = currentPath === href;
          return (
            <Link key={label} href={href} passHref >
              <ListItemButton
                selected={isActive}
                sx={{
                  color: isActive ? "white" : "rgba(255 255 255 / 0.8)",
                  bgcolor: isActive ? "rgba(255 255 255 / 0.12)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255 255 255 / 0.2)",
                  },
                  mb: 0.5,
                  borderRadius: 1,
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255 255 255 / 0.2)", my: 3 }} />

      <Typography
        variant="body2"
        sx={{
          color: "rgba(255 255 255 / 0.6)",
          userSelect: "none",
          fontStyle: "italic",
        }}
      >
        Your daily dose of motivation & learning!
      </Typography>
    </Box>
  );
};

export default UnifiedSidebar;
