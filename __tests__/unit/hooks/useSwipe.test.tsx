import { renderHook, waitFor } from '@testing-library/react-native';
import { useSwipe } from '@/hooks/useSwipe';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('expo-secure-store');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useSwipe', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should successfully swipe with fight action', async () => {
        const mockToken = 'test-token';
        const mockResponse = { matched: true, matchId: 'match123' };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useSwipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            targetId: 'user456',
            action: 'fight',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/matchmaking/swipe',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Authorization: 'Bearer test-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetId: 'user456',
                    action: 'fight',
                }),
            }),
        );
        expect(result.current.data).toEqual(mockResponse);
    });

    it('should successfully swipe with flee action', async () => {
        const mockToken = 'test-token';
        const mockResponse = { matched: false };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useSwipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            targetId: 'user789',
            action: 'flee',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/matchmaking/swipe',
            expect.objectContaining({
                body: JSON.stringify({
                    targetId: 'user789',
                    action: 'flee',
                }),
            }),
        );
    });

    it('should handle swipe error', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useSwipe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            targetId: 'user456',
            action: 'fight',
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('Network error'));
    });
});
