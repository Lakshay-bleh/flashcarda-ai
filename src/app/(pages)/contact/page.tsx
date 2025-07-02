'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  Collapse,
} from '@mui/material';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-dismiss success alert after 5 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const validate = () => {
    const errs: Partial<typeof formData> = {};

    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errs.email = 'Invalid email address.';
    }
    if (formData.phone.trim()) {
      if (
        !/^\+?[\d\s\-()]{7,}$/i.test(formData.phone.trim())
      ) {
        errs.phone = 'Invalid phone number.';
      }
    }
    if (!formData.message.trim()) errs.message = 'Message is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <Box
      component="main"
      className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans"
      sx={{
        px: { xs: 5, sm: 8, md: 12 },
        py: { xs: 6, sm: 9, md: 12 },
        overflowY: 'auto',
        alignItems: 'center',
        maxWidth: '100vw',
        gap: 4,
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
      >
        Contact Us
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          maxWidth: 600,
          textAlign: 'center',
          color: 'rgba(255 255 255 / 0.85)',
          userSelect: 'none',
          fontWeight: 500,
        }}
      >
        Have questions or feedback? Send us a message below!
      </Typography>

      <Paper
        elevation={10}
        component="form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Contact form"
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 3,
          bgcolor: 'rgba(255 255 255 / 0.12)',
          width: '100%',
          maxWidth: 600,
          userSelect: 'text',
          boxShadow:
            '0 8px 24px rgba(255, 105, 180, 0.3), 0 0 0 1px rgba(255, 105, 180, 0.2)',
        }}
      >
        <Stack spacing={3}>
          <TextField
            label="Name"
            variant="filled"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            InputLabelProps={{
              style: { color: 'rgba(255 255 255 / 0.85)', fontWeight: 600 },
            }}
            InputProps={{
              style: { color: 'white' },
              disableUnderline: true,
              sx: {
                bgcolor: 'rgba(255 255 255 / 0.18)',
                borderRadius: 1,
                transition: 'background-color 0.3s',
                '&:hover': { bgcolor: 'rgba(255 255 255 / 0.28)' },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255 105 180 / 0.3)', // pink highlight on focus
                  boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.5)',
                },
              },
            }}
            inputProps={{ 'aria-label': 'Name' }}
          />

          <TextField
            label="Email"
            variant="filled"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
            InputLabelProps={{
              style: { color: 'rgba(255 255 255 / 0.85)', fontWeight: 600 },
            }}
            InputProps={{
              style: { color: 'white' },
              disableUnderline: true,
              sx: {
                bgcolor: 'rgba(255 255 255 / 0.18)',
                borderRadius: 1,
                transition: 'background-color 0.3s',
                '&:hover': { bgcolor: 'rgba(255 255 255 / 0.28)' },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255 105 180 / 0.3)',
                  boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.5)',
                },
              },
            }}
            inputProps={{ 'aria-label': 'Email' }}
          />

          <TextField
            label="Phone (optional)"
            variant="filled"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone || 'Include country code if applicable'}
            InputLabelProps={{
              style: { color: 'rgba(255 255 255 / 0.85)', fontWeight: 600 },
            }}
            InputProps={{
              style: { color: 'white' },
              disableUnderline: true,
              sx: {
                bgcolor: 'rgba(255 255 255 / 0.18)',
                borderRadius: 1,
                transition: 'background-color 0.3s',
                '&:hover': { bgcolor: 'rgba(255 255 255 / 0.28)' },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255 105 180 / 0.3)',
                  boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.5)',
                },
              },
            }}
            inputProps={{ 'aria-label': 'Phone number' }}
          />

          <TextField
            label="Message"
            variant="filled"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            minRows={4}
            fullWidth
            error={!!errors.message}
            helperText={errors.message}
            InputLabelProps={{
              style: { color: 'rgba(255 255 255 / 0.85)', fontWeight: 600 },
            }}
            InputProps={{
              style: { color: 'white' },
              disableUnderline: true,
              sx: {
                bgcolor: 'rgba(255 255 255 / 0.18)',
                borderRadius: 1,
                transition: 'background-color 0.3s',
                '&:hover': { bgcolor: 'rgba(255 255 255 / 0.28)' },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255 105 180 / 0.3)',
                  boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.5)',
                },
              },
            }}
            inputProps={{ 'aria-label': 'Message' }}
          />

          <Stack direction="row" spacing={2} >
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleReset}
              sx={{
                borderColor: 'rgba(255 105 180 / 0.7)',
                color: 'rgba(255 105 180 / 0.7)',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': {
                borderColor: 'rgba(255 105 180 / 1)',
                color: 'rgba(255 105 180 / 1)',
                },
                transition: 'all 0.3s ease',
              }}
              aria-label="Reset form"
              >
              Clear form
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  background:
                    'linear-gradient(45deg, #ec4899 30%, #db2777 90%)', // pink gradient
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow:
                    '0 4px 15px 0 rgba(219, 39, 119, 0.75)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(45deg, #db2777 30%, #ec4899 90%)',
                    boxShadow:
                      '0 6px 20px 0 rgba(236, 72, 153, 0.9)',
                  },
                  '&:focus-visible': {
                    outline: '3px solid rgba(236, 72, 153, 0.8)',
                    outlineOffset: 2,
                  },
                }}
                aria-label="Send Message"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Stack>

          <Collapse in={submitted} unmountOnExit>
            <Alert
              severity="success"
              onClose={() => setSubmitted(false)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(5, 150, 105, 0.85)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.7)',
                userSelect: 'text',
              }}
              role="alert"
              aria-live="polite"
            >
              Thank you for your message! We will get back to you soon.
            </Alert>
          </Collapse>
        </Stack>
      </Paper>
    </Box>
  );
}
