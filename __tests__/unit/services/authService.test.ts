import { authService } from '@/services/authService';

describe('authService', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('login', () => {
        it('should successfully login with valid credentials', async () => {
            const mockResponse = {
                token: 'test-token-123',
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/users/login',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'password123',
                    }),
                }),
            );
        });

        it('should throw error on failed login', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Invalid credentials' }),
            });

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'wrong',
                }),
            ).rejects.toThrow('Invalid credentials');
        });

        it('should throw default error when no message provided', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'wrong',
                }),
            ).rejects.toThrow('Erreur de connexion');
        });
    });

    describe('signup', () => {
        it('should successfully signup with valid data', async () => {
            const mockResponse = {
                token: 'test-token-123',
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await authService.signup({
                email: 'newuser@example.com',
                password: 'password123',
            });

            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/users',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
        });

        it('should throw error on failed signup', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Email already exists' }),
            });

            await expect(
                authService.signup({
                    email: 'existing@example.com',
                    password: 'password123',
                }),
            ).rejects.toThrow('Email already exists');
        });
    });

    describe('getMe', () => {
        it('should fetch current user with valid token', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser',
                age: 25,
                gender: 'male',
                height: 180,
                weight: 75,
                disciplines: [],
                score: 0,
                fights: 0,
                victories: 0,
                defeats: 0,
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });

            const result = await authService.getMe('valid-token');

            expect(result).toEqual(mockUser);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/users/me',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer valid-token',
                    },
                }),
            );
        });

        it('should throw error with invalid token', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Unauthorized' }),
            });

            await expect(authService.getMe('invalid-token')).rejects.toThrow('Unauthorized');
        });
    });

    describe('getUserById', () => {
        it('should fetch user by id with valid token', async () => {
            const mockUser = {
                _id: 'user456',
                email: 'other@example.com',
                username: 'otheruser',
                age: 30,
                gender: 'female',
                height: 165,
                weight: 60,
                disciplines: [],
                score: 100,
                fights: 5,
                victories: 3,
                defeats: 2,
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });

            const result = await authService.getUserById('user456', 'valid-token');

            expect(result).toEqual(mockUser);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/users/user456',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer valid-token',
                    },
                }),
            );
        });

        it('should throw error when user not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'User not found' }),
            });

            await expect(authService.getUserById('nonexistent', 'valid-token')).rejects.toThrow(
                'User not found',
            );
        });
    });
});
