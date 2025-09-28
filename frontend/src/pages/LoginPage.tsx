import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            login(response.data.token);
            navigate('/'); // Перенаправляем на дашборд после успешного входа
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Вход
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Войти
                    </Button>
                    <RouterLink to="/register">
                        {"Нет аккаунта? Зарегистрироваться"}
                    </RouterLink>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;