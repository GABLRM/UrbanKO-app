import { onboardingSchema } from '@/features/onboarding/schema';
import { Gender } from '@/enums/gender';
import { Disciplines } from '@/enums/disciplines';

describe('Onboarding Schema', () => {
    const validData = {
        username: 'testuser',
        disciplines: [Disciplines.BOXING],
        gender: Gender.MALE,
        age: '25',
        weight: '75',
        height: '180',
    };

    it('should validate correct onboarding data', () => {
        const result = onboardingSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    describe('username validation', () => {
        it('should reject username shorter than 3 characters', () => {
            const invalidData = { ...validData, username: 'ab' };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Le pseudo doit contenir au moins 3 caractères',
                );
            }
        });

        it('should reject username longer than 20 characters', () => {
            const invalidData = { ...validData, username: 'a'.repeat(21) };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Le pseudo ne peut pas dépasser 20 caractères',
                );
            }
        });

        it('should accept username with exactly 3 characters', () => {
            const data = { ...validData, username: 'abc' };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should accept username with exactly 20 characters', () => {
            const data = { ...validData, username: 'a'.repeat(20) };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe('disciplines validation', () => {
        it('should reject empty disciplines array', () => {
            const invalidData = { ...validData, disciplines: [] };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Choisis au moins une discipline');
            }
        });

        it('should accept multiple disciplines', () => {
            const data = {
                ...validData,
                disciplines: [Disciplines.BOXING, Disciplines.MMA, Disciplines.JUDO],
            };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe('required fields validation', () => {
        it('should reject missing age', () => {
            const invalidData = { ...validData, age: '' };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("L'âge est obligatoire");
            }
        });

        it('should reject missing weight', () => {
            const invalidData = { ...validData, weight: '' };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Le poids est obligatoire');
            }
        });

        it('should reject missing height', () => {
            const invalidData = { ...validData, height: '' };
            const result = onboardingSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('La taille est obligatoire');
            }
        });
    });

    describe('gender validation', () => {
        it('should accept MALE gender', () => {
            const data = { ...validData, gender: Gender.MALE };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should accept FEMALE gender', () => {
            const data = { ...validData, gender: Gender.FEMALE };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should accept OTHER gender', () => {
            const data = { ...validData, gender: Gender.OTHER };
            const result = onboardingSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });
});
