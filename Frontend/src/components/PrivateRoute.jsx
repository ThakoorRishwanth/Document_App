// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister'; // Updated import
import Navbar from './components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import DocumentPage from './pages/DocumentPage';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path='/' element={<PrivateRoute element={<Dashboard />} />} />
        <Route path='/login' element={!user ? <LoginRegister isLogin /> : <Navigate to="/" />} />
        <Route path='/register' element={!user ? <LoginRegister /> : <Navigate to="/" />} />
        <Route path='/documents' element={<PrivateRoute element={<DocumentPage />} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
