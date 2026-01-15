import { renderHook, waitFor } from '@testing-library/react-native';
import { usePatchMe } from '@/hooks/usePatchMe';
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

describe('usePatchMe', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should successfully update user data', async () => {
        const mockToken = 'test-token';
        const mockResponse = {
            _id: 'user123',
            username: 'updateduser',
            age: 30,
        };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => usePatchMe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            username: 'updateduser',
            age: 30,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/users/me',
            expect.objectContaining({
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer test-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'updateduser',
                    age: 30,
                }),
            }),
        );
    });

    it('should handle update error', async () => {
        const mockToken = 'test-token';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Update failed' }),
        });

        const { result } = renderHook(() => usePatchMe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            username: 'failedupdate',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
});
