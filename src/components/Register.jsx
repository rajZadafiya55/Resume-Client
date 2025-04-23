// src/components/Register.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse same CSS for consistency
import api from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/api/auth/register', formData);
      navigate('/');
      toast.success('Registration successfully!');
    } catch (err) {
      setLoading(false);
      toast.error('Registration failed. Try a different email.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-wrapper">
        <Card className="login-card">
          <CardContent>
            <Typography variant="h4" className="fade-in-down" align="center" gutterBottom>
              Create Account 🚀
            </Typography>
            <Typography variant="subtitle1" align="center" className="fade-in-down" gutterBottom>
              Please fill in your details
            </Typography>

            <Box component="form" onSubmit={handleRegisterSubmit} className="fade-in-up">
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />
              ) : (
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Register
                </Button>
              )}
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Button variant="text" onClick={() => navigate('/')} sx={{ fontWeight: 'bold' }}>
                  Login
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
