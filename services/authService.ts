import { AuthData, UserResponse, userResponseSchema } from '@/schemas/authSchema';
import User from '@/type/user';

export const authService = {
    login: async (data: AuthData): Promise<UserResponse> => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur de connexion');
        }

        const json = await response.json();
        return userResponseSchema.parse(json);
    },

    signup: async (data: AuthData): Promise<UserResponse> => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de l'inscription");
        }

        const json = await response.json();
        return userResponseSchema.parse(json);
    },

    getMe: async (token: string): Promise<User> => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Erreur lors de la récupération de l'utilisateur");
        }

        const json = await response.json();
        return json as User;
    },
};
