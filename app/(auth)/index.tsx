import Button from '@/components/Button';
import Card from '@/components/Card';
import Header from '@/components/Header';
import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

export default function Index() {
    const [isLogin, setIsLogin] = useState(true);

    const router = useRouter();

    const schema = z.object({
        email: z
            .string({ required_error: "L'email est requis" })
            .email({ message: 'Adresse e-mail invalide' }),
        password: z
            .string({ required_error: 'Le mot de passe est requis' })
            .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    });

    type FormData = z.infer<typeof schema>;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        router.push('/onboarding');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    <Header />

                    <View style={styles.switchContainer}>
                        <Pressable
                            style={[styles.switchButton, isLogin && styles.activeButton]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={[styles.switchText, isLogin && styles.activeText]}>
                                Connexion
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.switchButton, !isLogin && styles.activeButton]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={[styles.switchText, !isLogin && styles.activeText]}>
                                Inscription
                            </Text>
                        </Pressable>
                    </View>

                    {/* TODO: Modifier avec le component de Audran */}
                    <View style={styles.innerContainer}>
                        <Card>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Email"
                                        placeholder="ton.email@example.com"
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={errors.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Mot de passe"
                                        placeholder="••••••••••••"
                                        style={{ marginTop: 30 }}
                                        secureTextEntry={true}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={errors.password?.message}
                                    />
                                )}
                            />
                            <Button
                                title={
                                    isLogin
                                        ? isSubmitting
                                            ? '🥊 En cours...'
                                            : '🥊 Se connecter'
                                        : isSubmitting
                                        ? '💪 En cours...'
                                        : "💪 S'inscrire"
                                }
                                onPress={handleSubmit(onSubmit)}
                                isDisabled={isSubmitting}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background,
        width: '100%',
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    card: {
        width: '100%',
        padding: 30,
        borderRadius: 20,
        backgroundColor: Colors.card,
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
        marginTop: 20,
        gap: 15,
    },
    switchButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    activeButton: {
        backgroundColor: Colors.primary,
    },
    switchText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    activeText: {
        color: 'white',
    },
});
