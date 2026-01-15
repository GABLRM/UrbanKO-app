describe('Onboarding E2E Tests', () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
        });
    });

    beforeEach(async () => {
        await device.reloadReactNative();

        const emailInput = element(by.id('email-input'));
        const passwordInput = element(by.id('password-input'));
        const signupButton = element(by.id('signup-button'));

        await element(by.text("S'inscrire")).tap();

        const randomEmail = `user${Date.now()}@example.com`;
        await emailInput.typeText(randomEmail);
        await passwordInput.typeText('password123');
        await signupButton.tap();

        await waitFor(element(by.id('onboarding-screen')))
            .toBeVisible()
            .withTimeout(5000);
    });

    describe('Step 1 - Username', () => {
        it('should display username step', async () => {
            await expect(element(by.text('Étape 1/3'))).toBeVisible();
            await expect(element(by.id('username-input'))).toBeVisible();
        });

        it('should validate username length', async () => {
            const usernameInput = element(by.id('username-input'));
            const nextButton = element(by.id('next-button'));

            await usernameInput.typeText('ab');
            await nextButton.tap();

            await expect(
                element(by.text('Le pseudo doit contenir au moins 3 caractères')),
            ).toBeVisible();
        });

        it('should navigate to step 2 with valid username', async () => {
            const usernameInput = element(by.id('username-input'));
            const nextButton = element(by.id('next-button'));

            await usernameInput.typeText('testuser');
            await nextButton.tap();

            await expect(element(by.text('Étape 2/3'))).toBeVisible();
        });
    });

    describe('Step 2 - Disciplines', () => {
        beforeEach(async () => {
            const usernameInput = element(by.id('username-input'));
            const nextButton = element(by.id('next-button'));

            await usernameInput.typeText('testuser');
            await nextButton.tap();
        });

        it('should display disciplines step', async () => {
            await expect(element(by.text('Étape 2/3'))).toBeVisible();
            await expect(element(by.id('disciplines-selector'))).toBeVisible();
        });

        it('should validate at least one discipline selected', async () => {
            const nextButton = element(by.id('next-button'));
            await nextButton.tap();

            await expect(element(by.text('Choisis au moins une discipline'))).toBeVisible();
        });

        it('should allow selecting multiple disciplines', async () => {
            await element(by.id('discipline-boxing')).tap();
            await element(by.id('discipline-mma')).tap();

            const nextButton = element(by.id('next-button'));
            await nextButton.tap();

            await expect(element(by.text('Étape 3/3'))).toBeVisible();
        });

        it('should allow navigating back to step 1', async () => {
            await element(by.id('back-button')).tap();

            await expect(element(by.text('Étape 1/3'))).toBeVisible();
        });
    });

    describe('Step 3 - Personal Info', () => {
        beforeEach(async () => {
            const usernameInput = element(by.id('username-input'));
            let nextButton = element(by.id('next-button'));

            await usernameInput.typeText('testuser');
            await nextButton.tap();

            await element(by.id('discipline-boxing')).tap();
            nextButton = element(by.id('next-button'));
            await nextButton.tap();
        });

        it('should display personal info step', async () => {
            await expect(element(by.text('Étape 3/3'))).toBeVisible();
            await expect(element(by.id('age-input'))).toBeVisible();
            await expect(element(by.id('weight-input'))).toBeVisible();
            await expect(element(by.id('height-input'))).toBeVisible();
        });

        it('should validate required fields', async () => {
            const submitButton = element(by.id('submit-button'));
            await submitButton.tap();

            await expect(element(by.text("L'âge est obligatoire"))).toBeVisible();
        });

        it('should complete onboarding and navigate to home', async () => {
            await element(by.id('gender-monsieur')).tap();
            await element(by.id('age-input')).typeText('25');
            await element(by.id('weight-input')).typeText('75');
            await element(by.id('height-input')).typeText('180');

            const submitButton = element(by.id('submit-button'));
            await submitButton.tap();

            await waitFor(element(by.id('home-screen')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should allow navigating back to step 2', async () => {
            await element(by.id('back-button')).tap();

            await expect(element(by.text('Étape 2/3'))).toBeVisible();
        });
    });
});
