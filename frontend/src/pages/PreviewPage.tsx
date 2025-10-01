import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PreviewPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const previewData = sessionStorage.getItem('articlePreview');
        if (previewData) {
            const { title, content } = JSON.parse(previewData);
            setTitle(title);
            setContent(content);
        }
    }, []);

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>
                <Box
                    className="tiptap"
                    dangerouslySetInnerHTML={{ __html: content }}
                    sx={{ border: 'none', minHeight: 'auto', p: 0 }}
                />
            </Paper>
        </Container>
    );
};

export default PreviewPage;