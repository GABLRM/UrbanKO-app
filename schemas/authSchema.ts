import {z} from 'zod';

// Schéma pour login/signup
export const authSchema = z.object({
    email: z
        .string({required_error: "L'email est requis"})
        .email({message: 'Adresse e-mail invalide'}),
    password: z
        .string({required_error: 'Le mot de passe est requis'})
        .min(6, {message: 'Le mot de passe doit contenir au moins 6 caractères'}),
});

export type AuthData = z.infer<typeof authSchema>;

// Schéma pour la réponse de l'API
export const userResponseSchema = z.object({
    token: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;