import { createContext, useContext, useState, ReactNode } from 'react';
import User from '@/type/user';

interface UserContextType {
    user: User | null;
    updateUser: (data: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = (data: User) => {
        setUser((prev) => (prev ? { ...prev, ...data } : data));
    };

    return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used inside <UserProvider>');
    }
    return context;
};
