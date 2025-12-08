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
import { type AuthData, authSchema } from '@/schemas/authSchema';
import { useLogin, useSignup } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthenticationContext';

export default function Index() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const { refreshUser } = useAuth();

    const login = useLogin();
    const signup = useSignup();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthData>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = (data: AuthData) => {
        if (isLogin) {
            // Connexion
            login.mutate(data, {
                onSuccess: async () => {
                    console.log('Connexion réussie !', data);
                    await refreshUser();
                    router.replace('/(app)/(tabs)');
                },
                onError: (error) => {
                    console.error('Erreur lors de la connexion', error);
                },
            });
        } else {
            // Inscription
            signup.mutate(data, {
                onSuccess: async () => {
                    console.log('Inscription réussie !', data);
                    await refreshUser();
                    router.replace('/(auth)/onboarding');
                },
                onError: (error) => {
                    console.error("Erreur lors de l'inscription", error);
                },
            });
        }
    };

    // Désactiver le bouton pendant la mutation
    const isLoading = login.isPending || signup.isPending;

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
                                        autoCapitalize="none"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value?.toLowerCase()}
                                        error={errors.email?.message}
                                        editable={!isLoading}
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
                                        style={{ marginTop: 10 }}
                                        secureTextEntry={true}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={errors.password?.message}
                                        editable={!isLoading}
                                    />
                                )}
                            />

                            {/* Afficher les erreurs de l'API */}
                            {login.error && (
                                <Text style={styles.errorText}>{login.error.message}</Text>
                            )}
                            {signup.error && (
                                <Text style={styles.errorText}>{signup.error.message}</Text>
                            )}

                            <Button
                                title={
                                    isLogin
                                        ? isLoading
                                            ? '🥊 En cours...'
                                            : '🥊 Se connecter'
                                        : isLoading
                                          ? '💪 En cours...'
                                          : "💪 S'inscrire"
                                }
                                onPress={handleSubmit(onSubmit)}
                                isDisabled={isLoading}
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
        color: Colors.white,
    },
    errorText: {
        color: Colors.primary,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
});
