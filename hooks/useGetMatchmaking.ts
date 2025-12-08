import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

interface QueryParams {
    limit?: number;
    cursor?: string;
}

export function useGetMatchmaking({ limit, cursor }: QueryParams = { limit: 10 }) {
    return useQuery({
        queryKey: ['matchmaking', { limit, cursor }],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync('token');

            const params = new URLSearchParams();

            if (typeof limit === 'number' && !Number.isNaN(limit)) {
                params.append('limit', String(limit));
            }

            if (cursor) {
                params.append('cursor', cursor);
            }

            const url = `${process.env.EXPO_PUBLIC_API_URL}/matchmaking?${params.toString()}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error('Erreur API matchmaking');
            }

            return res.json();
        },
    });
}
