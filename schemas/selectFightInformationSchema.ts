import { z } from 'zod';

// Schéma pour login/signup
export const selectFightInformationSchema = z.object({
    date: z.date({ required_error: 'La date est requise' }),
    location: z.string({ required_error: 'Le lieu est requise' }),
});

export type SelectFightInformationData = z.infer<typeof selectFightInformationSchema>;
