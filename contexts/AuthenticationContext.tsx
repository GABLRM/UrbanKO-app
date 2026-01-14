import { queryClient } from '@/lib/queryClient';
import { authService } from '@/services/authService';
import User from '@/type/user';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useEffect, useState } from 'react';

type AuthContextType = {
    user: User | undefined;
    token: string | null;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function fetchUser(token: string): Promise<User> {
        const userData = await authService.getMe(token);
        if (!userData) {
            throw new Error('No user data found');
        }
        return userData;
    }

    async function fetchToken(): Promise<string | null> {
        const token = SecureStore.getItem('token');

        if (!token) {
            return null;
        }
        return token;
    }

    const checkUser = useCallback(async () => {
        try {
            setIsLoading(true);

            const fetchedToken: string | null = await fetchToken();

            if (!fetchedToken) {
                setUser(undefined);
                return;
            }

            const fetchedUser: User = await fetchUser(fetchedToken);

            if (!fetchedUser) {
                throw new Error('No user data found');
            }

            setUser(fetchedUser);
            setToken(fetchedToken);
        } catch (error) {
            console.error('Error checking user authentication:', error);
            await SecureStore.deleteItemAsync('token');
            setUser(undefined);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            setUser(undefined);
            setToken(null);
            queryClient.clear();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        await checkUser();
    }, [checkUser]);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, setUser, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}
