import { renderHook, waitFor } from '@testing-library/react-native';
import { useRanking } from '@/hooks/useRanking';
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

describe('useRanking', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should fetch ranking data successfully without discipline', async () => {
        const mockToken = 'test-token';
        const mockRanking = [
            { _id: 'user1', username: 'champion', score: 1000 },
            { _id: 'user2', username: 'challenger', score: 800 },
        ];

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockRanking,
        });

        const { result } = renderHook(() => useRanking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockRanking);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/ranking',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-token',
                }),
            }),
        );
    });

    it('should fetch ranking data with discipline filter', async () => {
        const mockToken = 'test-token';
        const mockRanking = [{ _id: 'user1', username: 'boxer', score: 950 }];

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockRanking,
        });

        const { result } = renderHook(() => useRanking('BOXING'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockRanking);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/ranking?discipline=BOXING',
            expect.objectContaining({
                method: 'GET',
            }),
        );
    });

    it('should handle non-ok response', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal server error',
        });

        const { result } = renderHook(() => useRanking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toContain('500');
    });

    it('should handle fetch error', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Server error'));

        const { result } = renderHook(() => useRanking(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('Server error'));
    });
});
