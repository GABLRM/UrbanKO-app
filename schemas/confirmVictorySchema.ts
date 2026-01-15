import { z } from 'zod';

export const confirmVictorySchema = z.object({
    winner: z.string({ required_error: 'Le gagnant est requis' }),
    photo: z.string({ required_error: 'Une photo est requise pour la validation' }),
});

export type ConfirmVictoryData = z.infer<typeof confirmVictorySchema>;
