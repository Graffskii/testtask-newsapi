import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
    ToggleButtonGroup,
    ToggleButton,
    Divider,
} from '@mui/material';
import {
    FormatBold, FormatItalic, FormatStrikethrough, Code,
    FormatQuote, Title, LooksOne, LooksTwo, Looks3,
    Image as ImageIcon, AttachFile,
} from '@mui/icons-material';
import apiClient from '../api/axios';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) {
        return null;
    }

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelectAndUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Используем новый универсальный эндпоинт
            const response = await apiClient.post('/assets/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = `http://localhost:3000${response.data.data.url}`;

            if (type === 'image') {
                editor.chain().focus().setImage({ src: url }).run();
            } else {
                // Логика для вставки файла (пока просто ссылка)
                const linkMarkup = `<a href="${url}" download>${file.name}</a>`;
                editor.chain().focus().insertContent(linkMarkup).run();
            }

        } catch (error) {
            alert('Ошибка загрузки файла');
        } finally {
            // Сбрасываем значение инпута, чтобы можно было загрузить тот же файл снова
            event.target.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={imageInputRef}
                onChange={(e) => handleFileSelectAndUpload(e, 'image')}
                style={{ display: 'none' }}
                accept="image/*"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelectAndUpload(e, 'file')}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.zip"
            />

            <ToggleButtonGroup size="small" sx={{ mb: 1, flexWrap: 'wrap' }}>
                <ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <FormatBold />
                </ToggleButton>
                <ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <FormatItalic />
                </ToggleButton>
                <ToggleButton value="strike" selected={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <FormatStrikethrough />
                </ToggleButton>
                <ToggleButton value="code" selected={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
                    <Code />
                </ToggleButton>

                <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                
                <ToggleButton value="h1" selected={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <LooksOne />
                </ToggleButton>
                <ToggleButton value="h2" selected={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <LooksTwo />
                </ToggleButton>
                <ToggleButton value="h3" selected={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Looks3 />
                </ToggleButton>
                
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

                <ToggleButton value="blockquote" selected={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <FormatQuote />
                </ToggleButton>
                <ToggleButton value="codeBlock" selected={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code />
                </ToggleButton>
                
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

                <ToggleButton value="image" onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon />
                </ToggleButton>
                <ToggleButton value="file" onClick={() => fileInputRef.current?.click()}>
                    <AttachFile />
                </ToggleButton>
            </ToggleButtonGroup>
        </>
        
    );
};

export default MenuBar;