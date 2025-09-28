import React from 'react';
import { Editor } from '@tiptap/react';
import {
    ToggleButtonGroup,
    ToggleButton,
    Divider,
} from '@mui/material';
import {
    FormatBold, FormatItalic, FormatStrikethrough, Code,
    FormatQuote, Title, LooksOne, LooksTwo, Looks3
} from '@mui/icons-material';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) {
        return null;
    }

    return (
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
        </ToggleButtonGroup>
    );
};

export default MenuBar;