import { useQuery } from '@tanstack/react-query';
import User from '@/type/user';

export function useGetMe(token: string) {
    return useQuery({
        queryKey: ['users'],
        queryFn: async (): Promise<User> => {
            //todo: add ip in .env
            const response = await fetch('http://10.33.66.166:3000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.json();
        },
    });
}
