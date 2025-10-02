import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const EditorPage = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(!isNew); 
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [publishAt, setPublishAt] = useState<Date | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ 
                inline: false, 
            }),
        ],
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
                setStatus(article.status);
                if (article.publishAt) {
                    setPublishAt(new Date(article.publishAt));
                }
                if (editor) {
                    editor.commands.setContent(article.content);
                }
            })
            .catch(() => setError('Не удалось загрузить статью'))
            .finally(() => setLoading(false));
    }, [id, isNew, editor]);
    
    const handleSave = async () => {
        if (!editor) return;

        const payload: any = {
            title,
            content: editor.getHTML(),
            status,
        };

        if (publishAt) {
            payload.publishAt = publishAt.toISOString();
        }

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

    const handlePreview = () => {
        if (!editor) return;

        const previewData = {
            title,
            content: editor.getHTML(),
        };
        sessionStorage.setItem('articlePreview', JSON.stringify(previewData));

        window.open('/preview', '_blank');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isNew ? 'Создание новости' : 'Редактирование новости'}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, my: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="status-select-label">Статус</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={status}
                        label="Статус"
                        onChange={(e: SelectChangeEvent) => setStatus(e.target.value as 'draft' | 'published')}
                    >
                        <MenuItem value={'draft'}>Черновик</MenuItem>
                        <MenuItem value={'published'}>Опубликовать</MenuItem>
                    </Select>
                </FormControl>

                <DateTimePicker
                    label="Дата публикации"
                    value={publishAt}
                    onChange={(newValue) => setPublishAt(newValue)}
                    ampm={false} 
                />
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
                    <Button variant="contained" color="secondary" onClick={handlePreview}>
                        Предпросмотр
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