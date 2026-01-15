import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function useCancelFight() {
    return useMutation({
        mutationFn: async (fightId: string) => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/fights/${fightId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            return response.json();
        },
    });
}
