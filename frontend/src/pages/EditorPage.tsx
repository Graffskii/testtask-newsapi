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
    Alert
} from '@mui/material';

const EditorPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(!isNew); 

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });

    useEffect(() => {
        if (!isNew && id) {
            setLoading(true);
            apiClient.get(`/news/${id}`) 
                .then(response => {
                    const article: INews = response.data.data;
                    setTitle(article.title);
                    editor?.commands.setContent(article.content);
                })
                .catch(() => setError('Не удалось загрузить статью'))
                .finally(() => setLoading(false));
        }
    }, [id, isNew, editor]);
    
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isNew ? 'Создание новости' : 'Редактирование новости'}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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