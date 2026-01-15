describe('Profile E2E Tests', () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
        });
    });

    beforeEach(async () => {
        await device.reloadReactNative();

        const emailInput = element(by.id('email-input'));
        const passwordInput = element(by.id('password-input'));
        const loginButton = element(by.id('login-button'));

        await emailInput.typeText('test@example.com');
        await passwordInput.typeText('password123');
        await loginButton.tap();

        await waitFor(element(by.id('home-screen')))
            .toBeVisible()
            .withTimeout(5000);

        await element(by.id('profile-tab')).tap();
    });

    describe('Profile Display', () => {
        it('should display profile screen', async () => {
            await expect(element(by.id('profile-screen'))).toBeVisible();
        });

        it('should display user information', async () => {
            await expect(element(by.id('user-username'))).toBeVisible();
            await expect(element(by.id('user-stats'))).toBeVisible();
            await expect(element(by.id('user-disciplines'))).toBeVisible();
        });

        it('should display profile picture', async () => {
            await expect(element(by.id('profile-picture'))).toBeVisible();
        });

        it('should display edit button', async () => {
            await expect(element(by.id('edit-profile-button'))).toBeVisible();
        });
    });

    describe('Edit Profile', () => {
        it('should open edit profile modal', async () => {
            await element(by.id('edit-profile-button')).tap();

            await expect(element(by.id('edit-profile-modal'))).toBeVisible();
        });

        it('should update profile picture', async () => {
            await element(by.id('edit-profile-button')).tap();
            await element(by.id('change-picture-button')).tap();

            await element(by.id('select-from-gallery')).tap();

            await waitFor(element(by.id('save-profile-button')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('save-profile-button')).tap();

            await expect(element(by.id('profile-screen'))).toBeVisible();
        });

        it('should update profile information', async () => {
            await element(by.id('edit-profile-button')).tap();

            const cityInput = element(by.id('city-input'));
            await cityInput.clearText();
            await cityInput.typeText('Paris');

            await element(by.id('save-profile-button')).tap();

            await waitFor(element(by.text('Paris')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should cancel profile edit', async () => {
            await element(by.id('edit-profile-button')).tap();

            await element(by.id('cancel-edit-button')).tap();

            await expect(element(by.id('profile-screen'))).toBeVisible();
            await expect(element(by.id('edit-profile-modal'))).not.toBeVisible();
        });
    });

    describe('User Stats', () => {
        it('should display fight statistics', async () => {
            await expect(element(by.id('total-fights'))).toBeVisible();
            await expect(element(by.id('victories'))).toBeVisible();
            await expect(element(by.id('defeats'))).toBeVisible();
            await expect(element(by.id('score'))).toBeVisible();
        });
    });

    describe('Logout', () => {
        it('should display logout button', async () => {
            await expect(element(by.id('logout-button'))).toBeVisible();
        });

        it('should logout successfully', async () => {
            await element(by.id('logout-button')).tap();

            await waitFor(element(by.text('Se connecter')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });
});
