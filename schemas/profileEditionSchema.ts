import { Disciplines } from '@/enums/disciplines';
import { Gender } from '@/enums/gender';
import { z } from 'zod';

// Schéma pour login/signup
export const profileEditionSchema = z.object({
    username: z
        .string({ required_error: 'Le champs est requis' })
        .min(3, 'Le pseudo doit contenir au moins 3 caractères')
        .max(20, 'Le pseudo ne peut pas dépasser 20 caractères'),
    disciplines: z
        .array(z.nativeEnum(Disciplines), { required_error: 'Le champs est requis' })
        .min(1, 'Choisis au moins une discipline'),
    gender: z.nativeEnum(Gender, { required_error: 'Le champs est requis' }),
    age: z
        .number({
            required_error: 'Le champs est requis',
            invalid_type_error: 'Le champs est requis',
        })
        .min(0, 'Le nombre'),
    weight: z.number({
        required_error: 'Le champs est requis',
        invalid_type_error: 'Le champs est requis',
    }),
    height: z.number({
        required_error: 'Le champs est requis',
        invalid_type_error: 'Le champs est requis',
    }),
});

export type ProfileEditionData = z.infer<typeof profileEditionSchema>;
