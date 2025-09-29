import React from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string; // HTML-контент
}

// Стили для модального окна
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const PreviewModal = ({ open, onClose, title, content }: PreviewModalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Paper sx={style}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h4" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Box
                    className="tiptap" // Применяем те же стили, что и для редактора
                    dangerouslySetInnerHTML={{ __html: content }}
                    sx={{ border: 'none', minHeight: 'auto', p: 0 }}
                />
            </Paper>
        </Modal>
    );
};

export default PreviewModal;