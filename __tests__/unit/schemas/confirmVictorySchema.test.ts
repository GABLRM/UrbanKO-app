import { confirmVictorySchema } from '@/schemas/confirmVictorySchema';

describe('confirmVictorySchema', () => {
    it('should validate correct data', () => {
        const validData = {
            winner: 'user-123',
            photo: 'https://example.com/photo.jpg',
        };

        const result = confirmVictorySchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validData);
        }
    });

    it('should fail when winner is missing', () => {
        const invalidData = {
            photo: 'https://example.com/photo.jpg',
        };

        const result = confirmVictorySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Le gagnant est requis');
        }
    });

    it('should fail when photo is missing', () => {
        const invalidData = {
            winner: 'user-123',
        };

        const result = confirmVictorySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Une photo est requise pour la validation');
        }
    });

    it('should fail when both fields are missing', () => {
        const invalidData = {};

        const result = confirmVictorySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toHaveLength(2);
        }
    });
});
