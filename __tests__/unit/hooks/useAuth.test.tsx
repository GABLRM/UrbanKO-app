import { renderHook, waitFor } from '@testing-library/react-native';
import { useLogin, useSignup } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

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
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should login successfully and store token', async () => {
        const mockResponse = { token: 'test-token-123' };
        (authService.login as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            email: 'test@example.com',
            password: 'password123',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(authService.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(SecureStore.setItem).toHaveBeenCalledWith('token', 'test-token-123');
    });

    it('should handle login error', async () => {
        const mockError = new Error('Invalid credentials');
        (authService.login as jest.Mock).mockRejectedValue(mockError);

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            email: 'test@example.com',
            password: 'wrong',
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(mockError);
    });
});

describe('useSignup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should signup successfully and store token', async () => {
        const mockResponse = { token: 'new-token-456' };
        (authService.signup as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useSignup(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            email: 'newuser@example.com',
            password: 'password123',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(authService.signup).toHaveBeenCalledWith({
            email: 'newuser@example.com',
            password: 'password123',
        });
        expect(SecureStore.setItem).toHaveBeenCalledWith('token', 'new-token-456');
    });

    it('should handle signup error', async () => {
        const mockError = new Error('Email already exists');
        (authService.signup as jest.Mock).mockRejectedValue(mockError);

        const { result } = renderHook(() => useSignup(), {
            wrapper: createWrapper(),
        });

        result.current.mutate({
            email: 'existing@example.com',
            password: 'password123',
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(mockError);
    });
});
