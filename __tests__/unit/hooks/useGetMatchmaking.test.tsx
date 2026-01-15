import { renderHook, waitFor } from '@testing-library/react-native';
import { useGetMatchmaking } from '@/hooks/useGetMatchmaking';
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

describe('useGetMatchmaking', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should fetch matchmaking data successfully with default limit', async () => {
        const mockToken = 'test-token';
        const mockData = [
            { _id: 'user1', username: 'fighter1' },
            { _id: 'user2', username: 'fighter2' },
        ];

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        });

        const { result } = renderHook(() => useGetMatchmaking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/matchmaking?limit=2',
            expect.objectContaining({
                headers: {
                    Authorization: 'Bearer test-token',
                },
            }),
        );
    });

    it('should fetch matchmaking data with cursor parameter', async () => {
        const mockToken = 'test-token';
        const mockData = [{ _id: 'user3', username: 'fighter3' }];

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockData,
        });

        const { result } = renderHook(() => useGetMatchmaking({ limit: 1, cursor: 'cursor123' }), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/matchmaking?limit=1&cursor=cursor123',
            expect.objectContaining({
                headers: {
                    Authorization: 'Bearer test-token',
                },
            }),
        );
    });

    it('should handle non-ok response', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
        });

        const { result } = renderHook(() => useGetMatchmaking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('Erreur API matchmaking');
    });

    it('should handle fetch error', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useGetMatchmaking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('Network error'));
    });
});
