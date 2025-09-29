import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';

import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
          </Box>
      );
  }

  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/editor/new" element={<EditorPage />} />
              <Route path="/editor/:id" element={<EditorPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
};


function App() {
  return (
      <AuthProvider>
          <SocketProvider> 
                <Router>
                    <AppRoutes />
                </Router>
            </SocketProvider>
      </AuthProvider>
  );
}

export default App;