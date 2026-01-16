import { selectFightInformationSchema } from '@/schemas/selectFightInformationSchema';

describe('selectFightInformationSchema', () => {
    it('should validate correct data', () => {
        const validData = {
            date: new Date('2024-01-01'),
            location: 'Paris',
        };

        const result = selectFightInformationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validData);
        }
    });

    it('should fail when date is missing', () => {
        const invalidData = {
            location: 'Paris',
        };

        const result = selectFightInformationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('La date est requise');
        }
    });

    it('should fail when location is missing', () => {
        const invalidData = {
            date: new Date('2024-01-01'),
        };

        const result = selectFightInformationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Le lieu est requise');
        }
    });

    it('should fail when both fields are missing', () => {
        const invalidData = {};

        const result = selectFightInformationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toHaveLength(2);
        }
    });
});
