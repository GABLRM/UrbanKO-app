import { Disciplines } from '@/enums/disciplines';
import User from '@/type/user';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

export function useRanking(discipline?: Disciplines | null) {
    return useQuery({
        queryKey: ['ranking', discipline],
        queryFn: async (): Promise<User[]> => {
            const baseUrl = process.env.EXPO_PUBLIC_API_URL;
            const token = await SecureStore.getItemAsync('token');

            const url = new URL(`${baseUrl}/ranking`);

            if (discipline) {
                url.searchParams.append('discipline', discipline);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Erreur lors de la récupération du classement: ${response.status}, ${errorText}`,
                );
            }

            const data = await response.json();
            return data;
        },
        staleTime: 30 * 1000, // 30 secondes
    });
}

export function useMyRank() {
    return useQuery({
        queryKey: ['myRank'],
        queryFn: async (): Promise<{
            user: User;
            rank: number;
            totalUsers: number;
            percentile: number;
        }> => {
            const baseUrl = process.env.EXPO_PUBLIC_API_URL;
            const token = await SecureStore.getItemAsync('token');

            const response = await fetch(`${baseUrl}/ranking/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Erreur lors de la récupération du rang: ${response.status}, ${errorText}`,
                );
            }

            const data = await response.json();
            return data;
        },
        staleTime: 30 * 1000, // 30 secondes
    });
}
