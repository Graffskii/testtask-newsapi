import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './styles/global.scss';

const theme = createTheme({
    palette: {
        mode: 'dark', 
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> 
            <App />
        </ThemeProvider>
    </React.StrictMode>
);