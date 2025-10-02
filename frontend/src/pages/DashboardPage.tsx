import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
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
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DashboardPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const socket = useSocket();

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
    }, []); 

    useEffect(() => {
        if (!socket) return; 

        const handleScheduledPublish = (data: { updatedIds: string[] }) => {
            setNews(currentNews =>
                currentNews.map(article =>
                    data.updatedIds.includes(article._id)
                        ? { ...article, status: 'published' } 
                        : article
                )
            );
        };

        socket.on('news_scheduled_publish', handleScheduledPublish);

        return () => {
            socket.off('news_scheduled_publish', handleScheduledPublish);
        };
    }, [socket]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
            try {
                await apiClient.delete(`/news/${id}`);
                setNews(news.filter(n => n._id !== id));
            } catch (err) {
                setError('Не удалось удалить статью');
            }
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const response = await apiClient.put(`/news/${id}`, { status: 'published' });
            setNews(news.map(n => n._id === id ? response.data.data : n));
        } catch (err) {
            setError('Не удалось опубликовать статью');
        }
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
                                    <CardActions sx={{ justifyContent: 'space-between' }}>
                                        <Box>
                                            <Button
                                                size="small"
                                                component={RouterLink}
                                                to={`/editor/${article._id}`}
                                            >
                                                Редактировать
                                            </Button>
                                            {article.status === 'draft' && (
                                                <Button size="small" onClick={() => handlePublish(article._id)}>
                                                    Опубликовать
                                                </Button>
                                            )}
                                        </Box>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(article._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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