import { authSchema, userResponseSchema } from '@/schemas/authSchema';

describe('Auth Schemas', () => {
    describe('authSchema', () => {
        it('should validate correct email and password', () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123',
            };
            const result = authSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password123',
            };
            const result = authSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Adresse e-mail invalide');
            }
        });

        it('should reject missing email', () => {
            const invalidData = {
                password: 'password123',
            };
            const result = authSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("L'email est requis");
            }
        });

        it('should reject password shorter than 6 characters', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '12345',
            };
            const result = authSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    'Le mot de passe doit contenir au moins 6 caractères',
                );
            }
        });

        it('should reject missing password', () => {
            const invalidData = {
                email: 'test@example.com',
            };
            const result = authSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Le mot de passe est requis');
            }
        });

        it('should accept password with exactly 6 characters', () => {
            const validData = {
                email: 'test@example.com',
                password: '123456',
            };
            const result = authSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    describe('userResponseSchema', () => {
        it('should validate correct token response', () => {
            const validResponse = {
                token: 'valid-jwt-token-here',
            };
            const result = userResponseSchema.safeParse(validResponse);
            expect(result.success).toBe(true);
        });

        it('should reject response without token', () => {
            const invalidResponse = {};
            const result = userResponseSchema.safeParse(invalidResponse);
            expect(result.success).toBe(false);
        });

        it('should reject non-string token', () => {
            const invalidResponse = {
                token: 12345,
            };
            const result = userResponseSchema.safeParse(invalidResponse);
            expect(result.success).toBe(false);
        });
    });
});
