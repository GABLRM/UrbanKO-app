module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    watchman: false,
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|lucide-react-native|@tanstack/react-query)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/.expo/**',
        '!**/assets/**',
        '!**/__tests__/**',
        '!**/__mocks__/**',
        '!**/*.config.{js,ts}',
        '!**/app.json',
        '!**/babel.config.js',
        '!**/metro.config.js',
        '!**/jest.setup.js',
        '!**/expo-env.d.ts',
        // Exclude E2E tests and screens (they need E2E tests, not unit tests)
        '!**/e2e/**',
        '!**/app/**',
        '!**/features/**/*tsx', // Exclude feature components (they need integration tests)
        '!**/type/**', // Type definitions don't need tests
        // Exclude complex modal/camera components that require E2E testing
        '!**/components/CameraModal.tsx',
        '!**/components/SwipableCard.tsx', // Requires gesture testing in real device
        '!**/components/Select.tsx', // Complex UIManager interaction, better tested E2E
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    globals: {
        'ts-jest': {
            tsconfig: {
                jsx: 'react',
            },
        },
    },
};
