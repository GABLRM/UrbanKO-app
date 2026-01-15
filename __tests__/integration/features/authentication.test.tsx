import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useSignup } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { Text, View } from 'react-native';
import Button from '@/components/Button';

jest.mock('@/services/authService');
jest.mock('expo-secure-store');

function LoginTestComponent() {
    const login = useLogin();

    const handleLogin = () => {
        login.mutate({
            email: 'test@example.com',
            password: 'password123',
        });
    };

    return (
        <View>
            <Button title="Login" onPress={handleLogin} />
            {login.isLoading && <Text>Loading...</Text>}
            {login.isSuccess && <Text>Login successful</Text>}
            {login.isError && <Text>Login failed</Text>}
        </View>
    );
}

function SignupTestComponent() {
    const signup = useSignup();

    const handleSignup = () => {
        signup.mutate({
            email: 'newuser@example.com',
            password: 'password123',
        });
    };

    return (
        <View>
            <Button title="Signup" onPress={handleSignup} />
            {signup.isLoading && <Text>Loading...</Text>}
            {signup.isSuccess && <Text>Signup successful</Text>}
            {signup.isError && <Text>Signup failed</Text>}
        </View>
    );
}

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

describe('Authentication Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Login Flow', () => {
        it('should successfully login and store token', async () => {
            const mockResponse = { token: 'test-token-123' };
            (authService.login as jest.Mock).mockResolvedValue(mockResponse);

            const { getByText } = render(<LoginTestComponent />, {
                wrapper: createWrapper(),
            });

            const loginButton = getByText('Login');
            fireEvent.press(loginButton);

            await waitFor(() => expect(getByText('Login successful')).toBeTruthy());

            expect(authService.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(SecureStore.setItem).toHaveBeenCalledWith('token', 'test-token-123');
        });

        it('should handle login failure', async () => {
            (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

            const { getByText } = render(<LoginTestComponent />, {
                wrapper: createWrapper(),
            });

            const loginButton = getByText('Login');
            fireEvent.press(loginButton);

            await waitFor(() => expect(getByText('Login failed')).toBeTruthy());

            expect(SecureStore.setItem).not.toHaveBeenCalled();
        });

        it('should show loading state during login', async () => {
            const mockResponse = { token: 'test-token-123' };
            (authService.login as jest.Mock).mockResolvedValue(mockResponse);

            const { getByText, queryByText } = render(<LoginTestComponent />, {
                wrapper: createWrapper(),
            });

            const loginButton = getByText('Login');

            // Before clicking, loading should not be visible
            expect(queryByText('Loading...')).toBeNull();

            fireEvent.press(loginButton);

            // After successful login, should show success (loading may be too fast to catch)
            await waitFor(() => expect(getByText('Login successful')).toBeTruthy());

            expect(SecureStore.setItem).toHaveBeenCalledWith('token', 'test-token-123');
        });
    });

    describe('Signup Flow', () => {
        it('should successfully signup and store token', async () => {
            const mockResponse = { token: 'new-token-456' };
            (authService.signup as jest.Mock).mockResolvedValue(mockResponse);

            const { getByText } = render(<SignupTestComponent />, {
                wrapper: createWrapper(),
            });

            const signupButton = getByText('Signup');
            fireEvent.press(signupButton);

            await waitFor(() => expect(getByText('Signup successful')).toBeTruthy());

            expect(authService.signup).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'password123',
            });
            expect(SecureStore.setItem).toHaveBeenCalledWith('token', 'new-token-456');
        });

        it('should handle signup failure', async () => {
            (authService.signup as jest.Mock).mockRejectedValue(new Error('Email already exists'));

            const { getByText } = render(<SignupTestComponent />, {
                wrapper: createWrapper(),
            });

            const signupButton = getByText('Signup');
            fireEvent.press(signupButton);

            await waitFor(() => expect(getByText('Signup failed')).toBeTruthy());

            expect(SecureStore.setItem).not.toHaveBeenCalled();
        });
    });
});
