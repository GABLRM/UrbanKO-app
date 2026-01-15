import { Text, View, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';

type Props = {
    control: any;
    name: string;
    label?: string;
};

export function FormDatePicker({ control, name, label }: Props) {
    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <View style={styles.input}>
                        <DateTimePicker
                            value={value ?? new Date()}
                            mode="datetime"
                            minimumDate={new Date()}
                            display="default"
                            onChange={(_, selectedDate) => {
                                if (!selectedDate) {
                                    return;
                                }
                                onChange(selectedDate);
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderColor: Colors.customGrey,
        borderWidth: 1,
        width: '100%',
        backgroundColor: Colors.inputBackground,
        color: Colors.white,
        fontSize: 18,
        alignItems: 'center',
    },
    datePicker: {
        color: Colors.white,
    },
});
