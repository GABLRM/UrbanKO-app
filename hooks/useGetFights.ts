import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function useGetFights() {
    return useMutation({
        mutationFn: async () => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/fights`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        },
    });
}
