import { Colors } from '@/constants/Colors';
import { Gender } from '@/enums/gender';
import { OnboardingData, onboardingSchema } from '@/features/onboarding/schema';
import Step1 from '@/features/onboarding/Step1';
import Step2 from '@/features/onboarding/Step2';
import Step3 from '@/features/onboarding/Step3';
import { usePatchMe } from '@/hooks/usePatchMe';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthenticationContext';

export default function OnboardingScreen() {
    const [step, setStep] = useState(1);
    const { refreshUser } = useAuth();

    const router = useRouter();
    const patchMeMutation = usePatchMe();

    const methods = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        mode: 'onSubmit',
        defaultValues: {
            username: '',
            disciplines: [],
            gender: Gender.MONSIEUR,
            age: '',
            weight: '',
            height: '',
        },
    });

    const prevStep = () => setStep((prev) => prev - 1);

    const nextStep = async () => {
        let fieldsToValidate: (keyof OnboardingData)[] = [];

        if (step === 1) fieldsToValidate = ['username'];
        if (step === 2) fieldsToValidate = ['disciplines'];

        const isValid = await methods.trigger(fieldsToValidate);
        if (isValid) setStep((prev) => prev + 1);
    };

    const submitStep = async () => {
        const fieldsToValidate: (keyof OnboardingData)[] = ['gender', 'age', 'weight', 'height'];
        const isValid = await methods.trigger(fieldsToValidate);

        if (!isValid) return;

        const data = methods.getValues();
        const payload = {
            ...data,
            age: Number(data.age),
            weight: Number(data.weight),
            height: Number(data.height),
        };

        patchMeMutation.mutate(payload, {
            onSuccess: async () => {
                await refreshUser();
                router.push('/(app)/(tabs)');
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
            },
        });
    };

    const steps = [
        <Step1 key={1} nextStep={nextStep} />,
        <Step2 key={2} nextStep={nextStep} />,
        <Step3 key={3} onSubmit={submitStep} />,
    ];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextContainer}>
                            <Text style={{ color: Colors.secondary }}>Étape {step}/3</Text>
                        </View>
                        <Progress.Bar progress={step / 3} width={350} color={Colors.primary} />
                    </View>

                    <FormProvider {...methods}>
                        <View style={styles.stepContainer}>{steps[step - 1]}</View>
                    </FormProvider>

                    {step > 1 && (
                        <View style={styles.nav}>
                            <ArrowLeft color={Colors.secondary} size={14} />
                            <Button title="Précédent" color={Colors.secondary} onPress={prevStep} />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.background,
        width: '100%',
    },
    progressContainer: {
        alignItems: 'center',
        marginVertical: 30,
        width: '100%',
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 15,
        width: 350,
    },
    stepContainer: {
        flexDirection: 'column',
        width: '100%',
        padding: 20,
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
