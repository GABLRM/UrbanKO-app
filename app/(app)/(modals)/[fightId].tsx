import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    SelectFightInformationData,
    selectFightInformationSchema,
} from '@/schemas/selectFightInformationSchema';
import { FormDatePicker } from '@/components/FormDatePicker';
import { usePatchFight } from '@/hooks/usePatchFight';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function FightId() {
    const { fightId }: { fightId: string } = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState(false);

    const patchFightMutation = usePatchFight();
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SelectFightInformationData>({
        resolver: zodResolver(selectFightInformationSchema),
        defaultValues: {
            date: new Date(),
            location: '',
        },
        mode: 'onChange',
    });

    const onSave = (data: SelectFightInformationData) => {
        if (Object.values(errors).length) {
            return;
        }

        const payload = {
            id: fightId,
            ...data,
        };

        setIsLoading(true);
        patchFightMutation.mutate(payload, {
            onSuccess: () => {
                setIsLoading(false);
                router.back();
            },
            onError: (error: Error) => {
                console.error(error);
                setIsLoading(false);
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
                    <View style={{ paddingVertical: 20 }}>
                        <Pressable onPress={() => router.back()}>
                            <FontAwesome6 name={'arrow-left'} size={20} color={Colors.white} />
                        </Pressable>
                    </View>
                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Lieu"
                                    placeholder="Ex: 123 Rue Bagarre"
                                    textContentType="addressCity"
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value?.toLowerCase()}
                                    error={errors.location?.message}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <FormDatePicker control={control} name="date" label="Date du combat" />

                        {errors.date && <Text style={{ color: 'red' }}>{errors.date.message}</Text>}

                        <Pressable onPress={handleSubmit(onSave)} style={styles.confirmButton}>
                            <View>
                                <Text style={{ color: Colors.white }}>Sauvegarder</Text>
                            </View>
                        </Pressable>
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
    confirmButton: {
        width: '100%',
        backgroundColor: Colors.primary,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Colors.black,
        borderWidth: 2,
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
