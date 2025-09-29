import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const socket = io('http://localhost:3000', {
        autoConnect: false 
    });

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated, socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};