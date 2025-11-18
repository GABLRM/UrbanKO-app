import { Colors } from '@/constants/Colors';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type ButtonProps = {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    isDisabled?: boolean;
};

export default function Button({ title, onPress, style, isDisabled }: ButtonProps) {
    return (
        <Pressable style={styles.pressable} onPress={onPress} disabled={isDisabled}>
            <View style={[styles.container, style, isDisabled ? styles.disabled : undefined]}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
    },
    container: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    title: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '800',
    },
    disabled: {
        opacity: 0.5,
        backgroundColor: Colors.primary + '80',
    },
});
