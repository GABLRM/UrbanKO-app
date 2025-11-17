import Card from '@/components/Card';
import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { User } from 'lucide-react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';

interface Step1Props {
    nextStep: () => void;
}

export default function Step1({ nextStep }: Step1Props) {
    const { control, trigger } = useFormContext();

    return (
        <Card>
            <View style={styles.imageContainer}>
                <User color={Colors.primary} size={70} strokeWidth={1.25} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Quel est ton nom de Combattant ?</Text>
                <Text style={styles.description}>
                    Choisis un pseudo qui va faire trembler tes adversaires 💀
                </Text>
            </View>

            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="nickname"
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                        <>
                            <Input
                                label="Pseudonyme"
                                placeholder="Ex: LeDestructeur"
                                value={value}
                                autoCorrect={false}
                                onChangeText={(text) => {
                                    onChange(text);
                                    if (fieldState.error) {
                                        trigger('nickname');
                                    }
                                }}
                                onBlur={() => {
                                    onChange(value?.trim());
                                    onBlur();
                                }}
                                error={fieldState.error?.message as string | undefined}
                            />
                            <Text style={styles.nicknameMaxLength}>
                                {value?.length || 0}/20 caractères
                            </Text>
                        </>
                    )}
                />
            </View>

            <Button title="Suivant" onPress={nextStep} />
        </Card>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: 100,
        padding: 10,
        backgroundColor: Colors.darkPrimary,
    },
    textContainer: {
        gap: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.secondary,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
        gap: 5,
    },
    nicknameMaxLength: {
        textAlign: 'center',
        color: Colors.secondary,
    },
});
