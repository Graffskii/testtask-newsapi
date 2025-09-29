import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationBell = () => {
    const socket = useSocket();
    const [notifications, setNotifications] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: { message: string }) => {
            setNotifications((prev) => [data.message, ...prev]);
        };

        socket.on('news_created', handleNotification);
        socket.on('news_updated', handleNotification);
        socket.on('news_deleted', handleNotification);

        return () => {
            socket.off('news_created', handleNotification);
            socket.off('news_updated', handleNotification);
            socket.off('news_deleted', handleNotification);
        };
    }, [socket]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotifications([]);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    notifications.map((msg, index) => (
                        <MenuItem key={index} onClick={handleClose}>
                            {msg}
                        </MenuItem>
                    ))
                ) : (
                    <Typography sx={{ p: 2 }}>Нет новых уведомлений</Typography>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;