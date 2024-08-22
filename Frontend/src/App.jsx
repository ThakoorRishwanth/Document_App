import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import Navbar from './components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import DocumentPage from './pages/DocumentPage';
import ToastNotification from './components/ToastNotification';
import useAuth from './hooks/useAuth';

function App() {
  const { user, loading, logout } = useAuth(); // Include logout if needed
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Redirect to home if user is logged in and tries to access login/register pages
  const redirectPath = user ? '/' : '/login';

  useEffect(() => {
    if (loading) return; // Show loading state while auth is being checked
  }, [loading]);

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
    setTimeout(() => setToast({ open: false, message: '', severity: 'success' }), 6000); // Auto-hide after 6 seconds
  };

  const handleCloseToast = () => {
    setToast({ open: false, message: '', severity: 'success' });
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/login' element={!user ? <LoginRegister isLogin /> : <Navigate to="/" />} />
        <Route path='/register' element={!user ? <LoginRegister /> : <Navigate to="/" />} />
        <Route path='/documents' element={user ? <DocumentPage /> : <Navigate to="/login" />} />
        {/* Add a fallback route if needed */}
        <Route path='*' element={<Navigate to={redirectPath} />} />
      </Routes>
      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={handleCloseToast} 
      />
    </>
  );
}

export default App;
