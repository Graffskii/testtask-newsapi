import React, { useState } from 'react';
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

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }
        try {
            await apiClient.post('/auth/register', { email, password });
            // После успешной регистрации отправляем пользователя на страницу входа
            alert('Регистрация прошла успешно! Теперь вы можете войти.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
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
                    Регистрация
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
                        label="Пароль (минимум 6 символов)"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Зарегистрироваться
                    </Button>
                    <RouterLink to="/login">
                        {"Уже есть аккаунт? Войти"}
                    </RouterLink>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;