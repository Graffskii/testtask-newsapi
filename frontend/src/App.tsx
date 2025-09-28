import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Router>
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
            </Router>
        </AuthProvider>
    );
}

export default App;