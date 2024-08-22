import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const LoginRegister = ({ isLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Login successful!');
        navigate('/');
      } else {
        await register(username, email, password);
        toast.success('Registration successful!');
      }
    } catch (error) {
      toast.error(`${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    }
  };

  return (
    <Container>
      <Typography variant="h4">{isLogin ? 'Login' : 'Register'}</Typography>
      {!isLogin && (
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mb: 2 }}
      >
        {isLogin ? 'Login' : 'Register'}
      </Button>
      <Button
        variant="text"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'New User? Register' : 'Already have an account? Login'}
      </Button>
    </Container>
  );
};

export default LoginRegister;
