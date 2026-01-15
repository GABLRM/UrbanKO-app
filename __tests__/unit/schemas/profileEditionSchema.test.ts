import { profileEditionSchema } from '@/schemas/profileEditionSchema';
import { Disciplines } from '@/enums/disciplines';
import { Gender } from '@/enums/gender';

describe('Profile Edition Schema', () => {
    it('should validate correct profile data', () => {
        const validData = {
            username: 'testuser',
            image: 'https://example.com/image.jpg',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should validate without optional image field', () => {
        const validData = {
            username: 'testuser',
            disciplines: [Disciplines.MMA, Disciplines.JUDO],
            gender: Gender.FEMALE,
            age: 30,
            weight: 65,
            height: 170,
        };

        const result = profileEditionSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail with username too short', () => {
        const invalidData = {
            username: 'ab',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                'Le pseudo doit contenir au moins 3 caractères',
            );
        }
    });

    it('should fail with username too long', () => {
        const invalidData = {
            username: 'a'.repeat(21),
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                'Le pseudo ne peut pas dépasser 20 caractères',
            );
        }
    });

    it('should fail with missing username', () => {
        const invalidData = {
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should fail with empty disciplines array', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Choisis au moins une discipline');
        }
    });

    it('should fail with missing gender', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING],
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should fail with negative age', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: -1,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should fail with missing weight', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should fail with missing height', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: 25,
            weight: 75,
        };

        const result = profileEditionSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should accept all gender options', () => {
        const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
        genders.forEach((gender) => {
            const validData = {
                username: 'testuser',
                disciplines: [Disciplines.BOXING],
                gender,
                age: 25,
                weight: 75,
                height: 180,
            };

            const result = profileEditionSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    it('should accept all discipline options', () => {
        const disciplines = Object.values(Disciplines);
        const validData = {
            username: 'testuser',
            disciplines,
            gender: Gender.MALE,
            age: 25,
            weight: 75,
            height: 180,
        };

        const result = profileEditionSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
});
