import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import { Disciplines } from '@/enums/disciplines';
import { usePatchMe } from '@/hooks/usePatchMe';
import { ProfileEditionData, profileEditionSchema } from '@/schemas/profileEditionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileEditionModal() {
    const [isLoading, setIsLoading] = useState(false);
    const { user, refreshUser } = useAuth();
    const router = useRouter();

    const patchMeMutation = usePatchMe();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileEditionData>({
        resolver: zodResolver(profileEditionSchema),
        defaultValues: {
            username: user?.username ?? undefined,
            age: user?.age ?? undefined,
            height: user?.height,
            disciplines: user?.disciplines ?? [],
            weight: user?.weight,
            gender: user?.gender ?? undefined,
        },
        mode: 'onChange',
    });

    const onSave = (data: ProfileEditionData) => {
        if (Object.values(errors).length) {
            return;
        }

        setIsLoading(true);

        patchMeMutation.mutate(data, {
            onSuccess: async () => {
                await refreshUser();
                setIsLoading(false);
                router.navigate('/(app)/(tabs)/profile/[id]');
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
                setIsLoading(false);
                router.back();
            },
        });
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={false} statusBarTranslucent={true}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.closeText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit(onSave)}>
                            <Text
                                style={{
                                    ...styles.saveText,
                                    opacity: !!Object.values(errors).length ? 0.5 : 1,
                                }}
                            >
                                Enregistrer
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Pseudonyme"
                                    placeholder="Ex: LeDestructeur"
                                    textContentType="username"
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value?.toLowerCase()}
                                    error={errors.username?.message}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="age"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Âge"
                                    placeholder="ex: 25"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={value !== undefined ? String(value) : ''}
                                    error={errors.age?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="height"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Taille en cm"
                                    placeholder="ex: 180"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={!!value ? String(value) : ''}
                                    error={errors.height?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="weight"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Poids en kg"
                                    placeholder="ex: 80"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={!!value ? String(value) : ''}
                                    error={errors.weight?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="disciplines"
                            render={({ field: { value, onChange } }) => (
                                <View>
                                    <Text style={styles.label}>Disciplines</Text>

                                    <View style={styles.disciplinesInput}>
                                        {Object.entries(Disciplines).map(([key, enumValue]) => {
                                            const isSelected = value.includes(enumValue);
                                            return (
                                                <TouchableOpacity
                                                    key={key}
                                                    style={[
                                                        styles.button,
                                                        isSelected
                                                            ? styles.buttonSelected
                                                            : styles.buttonNotSelected,
                                                    ]}
                                                    onPress={() => {
                                                        if (isSelected) {
                                                            onChange(
                                                                value.filter(
                                                                    (discipline) =>
                                                                        discipline !== enumValue,
                                                                ),
                                                            );

                                                            return;
                                                        }

                                                        onChange([...(value ?? []), enumValue]);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: isSelected
                                                                ? Colors.white
                                                                : Colors.secondary,
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {enumValue}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        />
                        {errors.disciplines && (
                            <Text style={styles.error}>{errors.disciplines.message}</Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    modalContainer: {
        flex: 1,
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    closeText: {
        fontSize: 18,
        color: Colors.secondary,
    },
    saveText: {
        fontSize: 18,
        color: Colors.primary,
    },
    form: {
        flex: 1,
        gap: 10,
    },
    label: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.customGrey,
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    button: {
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    buttonSelected: { backgroundColor: Colors.primary },
    buttonNotSelected: { backgroundColor: Colors.background },
    disciplinesInput: {
        gap: 5,
        backgroundColor: Colors.inputBackground,
        padding: 10,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderColor: Colors.customGrey,
        borderWidth: 1,
        width: '100%',
    },
    error: {
        color: Colors.primary,
        marginTop: 5,
    },
});
