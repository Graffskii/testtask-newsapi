import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import apiClient from '../api/axios';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const initialToken = localStorage.getItem('token');
        if (initialToken) {
            setToken(initialToken);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
        }
        setIsLoading(false); 
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        setToken(null);
    };

    const value = {
        token,
        isAuthenticated: !!token,
        isLoading, // <-- ДОБАВИТЬ ЭТО
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};