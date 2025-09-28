import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import apiClient from '../api/axios';
import { type INews } from '../types/news';

import MenuBar from '../components/MenuBar';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert, 
    Input,
    Card,
    CardMedia,
} from '@mui/material';

const EditorPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(!isNew); 
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        if (isNew || !id) {
            setLoading(false); 
            return;
        }

        setLoading(true);
        apiClient.get(`/news/${id}`)
            .then(response => {
                const article: INews = response.data.data;
                setTitle(article.title);
                setImageUrl(article.imageUrl);
                if (editor) {
                    editor.commands.setContent(article.content);
                }
            })
            .catch(() => setError('Не удалось загрузить статью'))
            .finally(() => setLoading(false));

    }, [id, isNew, editor]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || isNew || !id) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file); 

        try {
            const response = await apiClient.post(`/news/${id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.data.imageUrl);
        } catch (err) {
            setError('Ошибка загрузки изображения');
        }
    };
    
    const handleSave = async () => {
        if (!editor) return;

        const payload = {
            title,
            content: editor.getHTML(),
        };

        try {
            if (isNew) {
                await apiClient.post('/news', payload);
            } else {
                await apiClient.put(`/news/${id}`, payload);
            }
            navigate('/'); 
        } catch (err) {
            setError('Ошибка сохранения');
        }
    };
    
    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (!editor) {
        return <div>Инициализация редактора...</div>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isNew ? 'Создание новости' : 'Редактирование новости'}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom>Изображение статьи</Typography>
                {imageUrl && (
                    <Card sx={{ maxWidth: 345, mb: 2 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={`http://localhost:3000${imageUrl}`} // <-- Формируем полный URL
                            alt="Изображение статьи"
                        />
                    </Card>
                )}
                {!isNew ? (
                    <label htmlFor="upload-button-file">
                        <Input
                            sx={{ display: 'none' }}
                            id="upload-button-file"
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        <Button variant="outlined" component="span">
                            {imageUrl ? 'Заменить изображение' : 'Загрузить изображение'}
                        </Button>
                    </label>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Сначала сохраните статью, чтобы можно было загрузить изображение.
                    </Typography>
                )}
            </Box>

            <Box component="form" noValidate autoComplete="off">
                <TextField
                    label="Заголовок"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSave}>
                        Сохранить
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Отмена
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditorPage;