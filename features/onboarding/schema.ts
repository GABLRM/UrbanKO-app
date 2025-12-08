import { Discipline } from '@/enums/discipline';
import { Gender } from '@/enums/gender';
import { z } from 'zod';

export const onboardingSchema = z.object({
    username: z
        .string()
        .min(3, 'Le pseudo doit contenir au moins 3 caractères')
        .max(20, 'Le pseudo ne peut pas dépasser 20 caractères'),
    disciplines: z.array(z.nativeEnum(Discipline)).min(1, 'Choisis au moins une discipline'),
    gender: z.nativeEnum(Gender),
    age: z.string().min(1, "L'âge est obligatoire"),
    weight: z.string().min(1, 'Le poids est obligatoire'),
    height: z.string().min(1, 'La taille est obligatoire'),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
