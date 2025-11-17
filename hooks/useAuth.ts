import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from '@/services/authService';
import {AuthData, UserResponse} from '@/schemas/authSchema';
import * as SecureStore from 'expo-secure-store';

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AuthData) => authService.login(data),

        onSuccess: async (data: UserResponse) => {
            // Sauvegarder le token
            SecureStore.setItem('token', data.token);

            // Mettre à jour le cache
            queryClient.setQueryData(['user'], data);
        },

        onError: (error: Error) => {
            console.error('Erreur de connexion:', error.message);
        },
    });
}

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AuthData) => authService.signup(data),

        onSuccess: async (data: UserResponse) => {
            SecureStore.setItem('token', data.token);
            queryClient.setQueryData(['user'], data);
        },

        onError: (error: Error) => {
            console.error("Erreur d'inscription:", error.message);
        },
    });
}