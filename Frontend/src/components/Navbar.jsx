// Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Container>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Document App</Link>
          </Typography>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/documents">Documents</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login / Register</Button>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
