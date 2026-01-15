import { renderHook, waitFor } from '@testing-library/react-native';
import { useGetUser } from '@/hooks/useGetUser';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('expo-secure-store');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useGetUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should fetch user data successfully', async () => {
        const mockToken = 'test-token';
        const mockUserId = 'user123';
        const mockUserData = {
            _id: 'user123',
            username: 'fighter1',
            email: 'fighter1@test.com',
        };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockUserData,
        });

        const { result } = renderHook(() => useGetUser(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockUserId);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockUserData);
        expect(global.fetch).toHaveBeenCalledWith(
            `http://localhost:3000/users/${mockUserId}`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-token',
                    'Content-Type': 'application/json',
                }),
            }),
        );
    });

    it('should handle fetch error', async () => {
        const mockToken = 'test-token';
        const mockUserId = 'user123';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useGetUser(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockUserId);

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('Network error'));
    });

    it('should handle missing token', async () => {
        const mockUserId = 'user123';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useGetUser(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockUserId);

        await waitFor(() => expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token'));

        expect(global.fetch).toHaveBeenCalledWith(
            `http://localhost:3000/users/${mockUserId}`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer null',
                }),
            }),
        );
    });
});
