import User from '@/type/user';
import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function usePatchMe() {
    return useMutation({
        mutationFn: async (payload: Partial<User>) => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            return response.json();
        },
    });
}
