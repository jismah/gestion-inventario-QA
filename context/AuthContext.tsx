// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/helpers/interfaces';


interface AuthContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    useEffect(() => {
        // Recuperar el estado del usuario desde localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};