import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { FightStatusEnum } from '@/type/fight';

type PatchFightDto = {
    id: string;
    location?: string;
    date?: Date;
    winner?: string;
    status?: FightStatusEnum;
    image?: string;
};

export function usePatchFight() {
    return useMutation({
        mutationFn: async (patchFightDto: PatchFightDto) => {
            const token = await SecureStore.getItemAsync('token');

            const fightId = patchFightDto.id;

            const dto = {
                location: patchFightDto.location,
                date: patchFightDto.date,
                winner: patchFightDto.winner,
                image: patchFightDto.image,
            };

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/fights/${fightId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...dto,
                }),
            });

            return response.json();
        },
    });
}
