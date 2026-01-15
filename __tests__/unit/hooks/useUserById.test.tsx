import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserById } from '@/hooks/useUserById';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('expo-secure-store');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useUserById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should fetch user by id successfully', async () => {
        const mockToken = 'test-token';
        const mockUser = {
            _id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            score: 100,
        };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        const { result } = renderHook(() => useUserById('user123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockUser);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/users/user123',
            expect.objectContaining({
                method: 'GET',
            }),
        );
    });

    it('should handle user not found error', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('User not found'));

        const { result } = renderHook(() => useUserById('nonexistent'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('User not found'));
    });
});
