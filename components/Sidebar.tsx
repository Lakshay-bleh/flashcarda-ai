'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const UnifiedSidebar: React.FC = () => {
  const currentPath = usePathname() || "/";

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        width: { xs: "100%", sm: 280 },
        bgcolor: "rgba(255 255 255 / 0.05)",
        backdropFilter: "blur(12px)",
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

      <Divider sx={{ borderColor: "rgba(255 255 255 / 0.2)" }} />

      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map(({ icon, label, href }) => {
          // Make active also if current path starts with href (for example /decks/123)
          const isActive = currentPath === href || currentPath.startsWith(href + "/");

          return (
            <Link key={label} href={href} passHref>
              <ListItemButton
                selected={isActive}
                sx={{
                  color: isActive ? "#90caf9" : "rgba(255 255 255 / 0.8)", // brighter blue on active
                  bgcolor: isActive ? "rgba(144, 202, 249, 0.2)" : "transparent", // stronger blue bg
                  "&:hover": {
                    bgcolor: "rgba(255 255 255 / 0.2)",
                  },
                  mb: 0.5,
                  borderRadius: 1,
                  transition: "background-color 0.3s, color 0.3s",
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
