import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function useSwipe() {
    return useMutation({
        mutationFn: async (payload: { targetId: string; action: 'fight' | 'flee' }) => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/matchmaking/swipe`, {
                method: 'POST',
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
