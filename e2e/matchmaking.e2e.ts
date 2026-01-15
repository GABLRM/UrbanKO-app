describe('Matchmaking E2E Tests', () => {
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

        await element(by.id('match-tab')).tap();
    });

    describe('Match Screen', () => {
        it('should display match screen', async () => {
            await expect(element(by.id('match-screen'))).toBeVisible();
        });

        it('should display opponent card', async () => {
            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should display fight and flee buttons', async () => {
            await expect(element(by.id('fight-button'))).toBeVisible();
            await expect(element(by.id('flee-button'))).toBeVisible();
        });
    });

    describe('Swipe Actions', () => {
        it('should swipe right (fight) on opponent', async () => {
            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('fight-button')).tap();

            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should swipe left (flee) on opponent', async () => {
            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('flee-button')).tap();

            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);
        });

        it('should display match success modal on mutual match', async () => {
            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('fight-button')).tap();

            await waitFor(element(by.id('match-success-modal')))
                .toBeVisible()
                .withTimeout(5000);

            await expect(element(by.text("C'est un match !"))).toBeVisible();
        });

        it('should close match success modal', async () => {
            await waitFor(element(by.id('opponent-card')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('fight-button')).tap();

            await waitFor(element(by.id('match-success-modal')))
                .toBeVisible()
                .withTimeout(5000);

            await element(by.id('close-match-modal')).tap();

            await expect(element(by.id('match-success-modal'))).not.toBeVisible();
        });
    });

    describe('No More Opponents', () => {
        it('should display no more opponents message when stack is empty', async () => {
            for (let i = 0; i < 10; i++) {
                await waitFor(element(by.id('opponent-card')))
                    .toBeVisible()
                    .withTimeout(5000);

                await element(by.id('flee-button')).tap();
            }

            await waitFor(element(by.text('Plus de combattants disponibles')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });
});
