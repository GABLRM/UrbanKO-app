import { useQuery } from '@tanstack/react-query';
import User from '@/app/type/user';

export function useGetMe(token: string) {
    return useQuery({
        queryKey: ['users'],
        queryFn: async (): Promise<User> => {
            const response = await fetch('http://10.33.66.162:3000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        },
    });
}
