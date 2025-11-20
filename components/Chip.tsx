import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

type ChipProps = {
    text: string;
};

export default function Chip({ text }: ChipProps) {
    return (
        <TouchableOpacity style={styles.chip}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        backgroundColor: Colors.chipRed,
        borderColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    text: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
