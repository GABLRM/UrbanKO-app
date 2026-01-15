import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

type PatchFightDto = {
    fightId: string;
    winnerId: string;
    image: string;
};

export function useFinishFight() {
    return useMutation({
        mutationFn: async (patchFightDto: PatchFightDto) => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/fights/finish`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...patchFightDto,
                }),
            });

            return response.json();
        },
    });
}
