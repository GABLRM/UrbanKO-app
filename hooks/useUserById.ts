import User from '@/type/user';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/authService';

export function useUserById(id: string | undefined) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async (): Promise<User> => {
            if (!id) {
                throw new Error('User ID is required');
            }

            const token = await SecureStore.getItemAsync('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            return authService.getUserById(id, token);
        },
        enabled: !!id,
        staleTime: 60 * 1000, // 60 secondes
    });
}
