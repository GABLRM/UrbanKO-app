import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Select } from '@/components/Select';
import { Colors } from '@/constants/Colors';
import { Gender } from '@/enums/gender';
import { Scale } from 'lucide-react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

interface Step3Props {
    onSubmit: () => void;
}

export default function Step3({ onSubmit }: Step3Props) {
    const { control, trigger } = useFormContext();

    return (
        <Card>
            <View style={styles.imageContainer}>
                <Scale color={Colors.primary} size={70} strokeWidth={1.25} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Tes stats physiques</Text>
                <Text style={styles.description}>
                    Pour matcher avec des adversaires à ta taille 📊
                </Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.genderAgeContainer}>
                    <View style={{ flex: 1 }}>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange, value }, fieldState }) => (
                                <Select
                                    label="Genre"
                                    value={value}
                                    placeholder="Choisir ton genre"
                                    onChange={(val) => {
                                        onChange(val);
                                        if (fieldState.error) trigger('gender');
                                    }}
                                    options={[
                                        { label: Gender.MONSIEUR, value: Gender.MONSIEUR },
                                        { label: Gender.MADAME, value: Gender.MADAME },
                                    ]}
                                />
                            )}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Controller
                            control={control}
                            name="age"
                            render={({ field: { onChange, value }, fieldState }) => (
                                <Input
                                    label="Âge"
                                    placeholder="Ex: 25"
                                    value={value}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        onChange(text);
                                        if (fieldState.error) trigger('age');
                                    }}
                                    error={fieldState.error?.message as string | undefined}
                                />
                            )}
                        />
                    </View>
                </View>

                <Controller
                    control={control}
                    name="weight"
                    render={({ field: { onChange, value }, fieldState }) => (
                        <Input
                            label="Poids (kg)"
                            placeholder="Ex: 70"
                            value={value}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                onChange(text);
                                if (fieldState.error) trigger('weight');
                            }}
                            error={fieldState.error?.message as string | undefined}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="height"
                    render={({ field: { onChange, value }, fieldState }) => (
                        <Input
                            label="Taille (cm)"
                            placeholder="Ex: 180"
                            value={value}
                            keyboardType="numeric"
                            onChangeText={(text: string) => {
                                onChange(text);
                                if (fieldState.error) trigger('height');
                            }}
                            error={fieldState.error?.message as string | undefined}
                        />
                    )}
                />
            </View>

            <Button title="🎯 C'est parti !" onPress={onSubmit} />
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
        color: Colors.white,
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
        gap: 15,
    },
    genderAgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});
