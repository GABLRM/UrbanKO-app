import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthenticationContext';
import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/services/authService');
jest.mock('expo-secure-store');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
};

describe('AuthenticationContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useAuth', () => {
        it('should throw error when used outside AuthProvider', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow('useAuth must be used within an AuthContextProvider');

            consoleError.mockRestore();
        });

        it('should provide auth context when used inside AuthProvider', async () => {
            (SecureStore.getItem as jest.Mock).mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current).toHaveProperty('user');
            expect(result.current).toHaveProperty('token');
            expect(result.current).toHaveProperty('isLoading');
            expect(result.current).toHaveProperty('logout');
            expect(result.current).toHaveProperty('refreshUser');
        });
    });

    describe('AuthProvider', () => {
        it('should initialize with no user when no token exists', async () => {
            (SecureStore.getItem as jest.Mock).mockReturnValue(null);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.user).toBeUndefined();
            expect(result.current.token).toBeNull();
        });

        it('should load user when valid token exists', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser',
                age: 25,
                gender: 'male',
                height: 180,
                weight: 75,
                disciplines: [],
                score: 0,
                fights: 0,
                victories: 0,
                defeats: 0,
            };

            (SecureStore.getItem as jest.Mock).mockReturnValue('valid-token');
            (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.token).toBe('valid-token');
        });

        it('should handle error when token is invalid', async () => {
            (SecureStore.getItem as jest.Mock).mockReturnValue('invalid-token');
            (authService.getMe as jest.Mock).mockRejectedValue(new Error('Unauthorized'));
            (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isLoading).toBe(false));

            expect(result.current.user).toBeUndefined();
            expect(result.current.token).toBeNull();
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
        });

        it('should logout successfully', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser',
                age: 25,
                gender: 'male',
                height: 180,
                weight: 75,
                disciplines: [],
                score: 0,
                fights: 0,
                victories: 0,
                defeats: 0,
            };

            (SecureStore.getItem as jest.Mock).mockReturnValue('valid-token');
            (authService.getMe as jest.Mock).mockResolvedValue(mockUser);
            (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.user).toEqual(mockUser));

            await result.current.logout();

            await waitFor(() => {
                expect(result.current.user).toBeUndefined();
                expect(result.current.token).toBeNull();
            });

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
        });

        it('should refresh user data', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser',
                age: 25,
                gender: 'male',
                height: 180,
                weight: 75,
                disciplines: [],
                score: 0,
                fights: 0,
                victories: 0,
                defeats: 0,
            };

            const updatedUser = { ...mockUser, username: 'updateduser' };

            (SecureStore.getItem as jest.Mock).mockReturnValue('valid-token');
            (authService.getMe as jest.Mock).mockResolvedValueOnce(mockUser);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.user).toEqual(mockUser));

            (authService.getMe as jest.Mock).mockResolvedValueOnce(updatedUser);

            await result.current.refreshUser();

            await waitFor(() => {
                expect(result.current.user).toEqual(updatedUser);
            });
        });
    });
});
