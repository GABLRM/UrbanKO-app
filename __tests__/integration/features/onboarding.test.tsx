import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingData } from '@/features/onboarding/schema';
import { Gender } from '@/enums/gender';
import { Disciplines } from '@/enums/disciplines';
import { View, Text } from 'react-native';
import Button from '@/components/Button';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

function OnboardingTestComponent() {
    const methods = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            username: '',
            disciplines: [],
            gender: Gender.MALE,
            age: '',
            weight: '',
            height: '',
        },
    });

    const onSubmit = (data: OnboardingData) => {
        console.log('Onboarding data:', data);
    };

    return (
        <FormProvider {...methods}>
            <View>
                <Text>Onboarding Form</Text>
                <Button title="Submit" onPress={methods.handleSubmit(onSubmit)} />
                {methods.formState.errors.username && (
                    <Text>Username error: {methods.formState.errors.username.message}</Text>
                )}
                {methods.formState.errors.disciplines && (
                    <Text>Disciplines error: {methods.formState.errors.disciplines.message}</Text>
                )}
            </View>
        </FormProvider>
    );
}

describe('Onboarding Integration Tests', () => {
    it('should validate onboarding form correctly', async () => {
        const { getByText } = render(<OnboardingTestComponent />, {
            wrapper: createWrapper(),
        });

        expect(getByText('Onboarding Form')).toBeTruthy();
    });

    it('should validate correct onboarding data structure', () => {
        const validData: OnboardingData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MALE,
            age: '25',
            weight: '75',
            height: '180',
        };

        const result = onboardingSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should reject invalid username', () => {
        const invalidData = {
            username: 'ab',
            disciplines: [Disciplines.BOXING],
            gender: Gender.MONSIEUR,
            age: '25',
            weight: '75',
            height: '180',
        };

        const result = onboardingSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should reject empty disciplines', () => {
        const invalidData = {
            username: 'testuser',
            disciplines: [],
            gender: Gender.MONSIEUR,
            age: '25',
            weight: '75',
            height: '180',
        };

        const result = onboardingSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should handle multiple disciplines', () => {
        const validData = {
            username: 'testuser',
            disciplines: [Disciplines.BOXING, Disciplines.MMA, Disciplines.JUDO],
            gender: Gender.FEMALE,
            age: '30',
            weight: '65',
            height: '170',
        };

        const result = onboardingSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.disciplines).toHaveLength(3);
        }
    });
});
