import { createContext, useContext, useState, ReactNode } from 'react';
import User from '@/app/type/user';

interface UserContextType {
    user: User | null;
    token: string | null;
    updateUser: (data: User) => void;
    updateToken: (token: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const updateUser = (data: User) => {
        setUser((prev) => (prev ? { ...prev, ...data } : data));
    };

    const updateToken = (token: string) => {
        setToken(token);
    };

    return (
        <UserContext.Provider value={{ user, token, updateUser, updateToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used inside <UserProvider>');
    }
    return context;
};
