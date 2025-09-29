import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import { type INews } from '../types/news';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Button,
    Typography,
    AppBar,
    Toolbar,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    Grid,
} from '@mui/material';

const DashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await apiClient.get('/news');
                setNews(response.data.data);
            } catch (err) {
                setError('Не удалось загрузить новости');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []); // Пустой массив зависимостей означает, что эффект выполнится 1 раз при монтировании

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Мои Новости
                    </Typography>
                    <NotificationBell /> 
                    <Button color="inherit" onClick={() => navigate('/editor/new')}>
                        Создать новость
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Выйти
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {news.length > 0 ? (
                        news.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {article.title}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            Статус: {article.status === 'draft' ? 'Черновик' : 'Опубликовано'}
                                        </Typography>
                                        <Typography variant="body2">
                                            Создано: {new Date(article.createdAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            component={RouterLink}
                                            to={`/editor/${article._id}`}
                                        >
                                            Редактировать
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography sx={{ p: 2 }}>У вас пока нет новостей. Создайте первую!</Typography>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default DashboardPage;