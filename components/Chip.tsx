import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
        backgroundColor: '#4a2629',
        borderColor: '#cb2626',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    text: {
        color: '#db2626',
        fontWeight: 'bold',
    },
});
