import { renderHook, waitFor } from '@testing-library/react-native';
import { useUploadImage } from '@/hooks/useUploadImage';
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

describe('useUploadImage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should upload image successfully', async () => {
        const mockToken = 'test-token';
        const mockData = {
            userId: 'user123',
            imageInfo: {
                uri: 'file://path/to/image.jpg',
                name: 'profile.jpg',
                mimetype: 'image/jpeg',
            },
        };
        const mockUrl = 'http://localhost:3000/uploads/profile.jpg';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => mockUrl,
        });

        const { result } = renderHook(() => useUploadImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(mockUrl);
        expect(global.fetch).toHaveBeenCalledWith(
            `http://localhost:3000/bucket/image/${mockData.userId}/${mockData.imageInfo.name}`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-token',
                }),
            }),
        );
    });

    it('should handle upload error', async () => {
        const mockToken = 'test-token';
        const mockData = {
            userId: 'user123',
            imageInfo: {
                uri: 'file://path/to/image.jpg',
                name: 'profile.jpg',
                mimetype: 'image/jpeg',
            },
        };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Upload failed'));

        const { result } = renderHook(() => useUploadImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error('Upload failed'));
    });

    it('should replace localhost URL with EXPO_PUBLIC_API_URL when set', async () => {
        const mockToken = 'test-token';
        const originalEnv = process.env.EXPO_PUBLIC_API_URL;
        process.env.EXPO_PUBLIC_API_URL = 'https://api.example.com';

        const mockData = {
            userId: 'user123',
            imageInfo: {
                uri: 'file://path/to/image.jpg',
                name: 'profile.jpg',
                mimetype: 'image/jpeg',
            },
        };
        const mockUrl = 'http://localhost:3000/uploads/profile.jpg';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => mockUrl,
        });

        const { result } = renderHook(() => useUploadImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe('https://api.example.com/uploads/profile.jpg');

        // Restore original env
        process.env.EXPO_PUBLIC_API_URL = originalEnv;
    });

    it('should not replace URL if it does not contain localhost', async () => {
        const mockToken = 'test-token';
        const mockData = {
            userId: 'user123',
            imageInfo: {
                uri: 'file://path/to/image.jpg',
                name: 'profile.jpg',
                mimetype: 'image/jpeg',
            },
        };
        const mockUrl = 'https://cdn.example.com/uploads/profile.jpg';

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => mockUrl,
        });

        const { result } = renderHook(() => useUploadImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(mockUrl);
    });

    it('should handle missing token', async () => {
        const mockData = {
            userId: 'user123',
            imageInfo: {
                uri: 'file://path/to/image.jpg',
                name: 'profile.jpg',
                mimetype: 'image/jpeg',
            },
        };

        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => 'http://localhost:3000/uploads/profile.jpg',
        });

        const { result } = renderHook(() => useUploadImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token'));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer null',
                }),
            }),
        );
    });
});
