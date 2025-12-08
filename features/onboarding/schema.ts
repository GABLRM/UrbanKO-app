import { Disciplines } from '@/enums/disciplines';
import { Gender } from '@/enums/gender';
import { z } from 'zod';

export const onboardingSchema = z.object({
    username: z
        .string()
        .min(3, 'Le pseudo doit contenir au moins 3 caractères')
        .max(20, 'Le pseudo ne peut pas dépasser 20 caractères'),
    disciplines: z
        .array(z.enum(Object.keys(Disciplines) as [keyof typeof Disciplines]))
        .min(1, 'Choisis au moins une discipline'),
    gender: z.enum([Gender.MADAME, Gender.MONSIEUR]),
    age: z.string().min(1, "L'âge est obligatoire"),
    weight: z.string().min(1, 'Le poids est obligatoire'),
    height: z.string().min(1, 'La taille est obligatoire'),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
