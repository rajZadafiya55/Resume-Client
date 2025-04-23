// src/components/Login.js
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
import './Login.css';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    toast.success('login successfully!');
    } catch (err) {
      setLoading(false);
      toast.error('Please check your credentials.');

    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-wrapper">
        <Card className="login-card">
          <CardContent>
            <Typography variant="h4" className="fade-in-down" align="center" gutterBottom>
              Welcome Back 
            </Typography>
            <Typography variant="subtitle1" align="center" className="fade-in-down" gutterBottom>
              Please login to your account
            </Typography>

            <Box component="form" onSubmit={handleLoginSubmit} className="fade-in-up">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />
              ) : (
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Login
                </Button>
              )}
              
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2">
                Don’t have an account?{' '}
                <Button variant="text" onClick={() => navigate('/register')} sx={{ fontWeight: 'bold' }}>
                  Register
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
