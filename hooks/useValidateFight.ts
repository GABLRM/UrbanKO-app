import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { FightStatusEnum } from '@/type/fight';

type ValidateFightDto = {
    fightId: string;
    status: FightStatusEnum;
};

export function useValidateFight() {
    return useMutation({
        mutationFn: async (validateFightDto: ValidateFightDto) => {
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/fights/accept/${validateFightDto.fightId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.json();
        },
    });
}
