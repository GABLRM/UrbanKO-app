describe('Authentication E2E Tests', () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            permissions: { notifications: 'YES' },
        });
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    describe('Login Flow', () => {
        it('should display login screen on app launch', async () => {
            await expect(element(by.text('Se connecter'))).toBeVisible();
        });

        it('should allow user to navigate between login and signup', async () => {
            await element(by.text("S'inscrire")).tap();
            await expect(element(by.text('Créer un compte'))).toBeVisible();

            await element(by.text('Se connecter')).tap();
            await expect(element(by.text('Connexion'))).toBeVisible();
        });

        it('should validate email and password fields', async () => {
            const emailInput = element(by.id('email-input'));
            const passwordInput = element(by.id('password-input'));
            const loginButton = element(by.id('login-button'));

            await emailInput.typeText('invalid-email');
            await passwordInput.typeText('123');
            await loginButton.tap();

            await expect(element(by.text('Adresse e-mail invalide'))).toBeVisible();
        });

        it('should successfully login with valid credentials', async () => {
            const emailInput = element(by.id('email-input'));
            const passwordInput = element(by.id('password-input'));
            const loginButton = element(by.id('login-button'));

            await emailInput.typeText('test@example.com');
            await passwordInput.typeText('password123');
            await loginButton.tap();

            await waitFor(element(by.id('home-screen')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });

    describe('Signup Flow', () => {
        beforeEach(async () => {
            await element(by.text("S'inscrire")).tap();
        });

        it('should display signup form', async () => {
            await expect(element(by.text('Créer un compte'))).toBeVisible();
            await expect(element(by.id('email-input'))).toBeVisible();
            await expect(element(by.id('password-input'))).toBeVisible();
        });

        it('should validate signup fields', async () => {
            const emailInput = element(by.id('email-input'));
            const passwordInput = element(by.id('password-input'));
            const signupButton = element(by.id('signup-button'));

            await emailInput.typeText('test@example.com');
            await passwordInput.typeText('12345');
            await signupButton.tap();

            await expect(
                element(by.text('Le mot de passe doit contenir au moins 6 caractères')),
            ).toBeVisible();
        });

        it('should successfully signup and navigate to onboarding', async () => {
            const emailInput = element(by.id('email-input'));
            const passwordInput = element(by.id('password-input'));
            const signupButton = element(by.id('signup-button'));

            const randomEmail = `user${Date.now()}@example.com`;
            await emailInput.typeText(randomEmail);
            await passwordInput.typeText('password123');
            await signupButton.tap();

            await waitFor(element(by.id('onboarding-screen')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });

    describe('Logout Flow', () => {
        beforeEach(async () => {
            const emailInput = element(by.id('email-input'));
            const passwordInput = element(by.id('password-input'));
            const loginButton = element(by.id('login-button'));

            await emailInput.typeText('test@example.com');
            await passwordInput.typeText('password123');
            await loginButton.tap();

            await waitFor(element(by.id('home-screen')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should successfully logout', async () => {
            await element(by.id('profile-tab')).tap();
            await element(by.id('logout-button')).tap();

            await waitFor(element(by.text('Se connecter')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });
});
