import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

type InputProps = {
    label: string;
    placeholder: string;
    style?: StyleProp<ViewStyle>;
    secureTextEntry?: boolean;
    error?: string;
    isNumber?: boolean;
} & TextInputProps;

export default function Input({
    label,
    placeholder,
    style,
    secureTextEntry,
    error,
    isNumber,
    value,
    onChangeText,
    onBlur,
}: InputProps) {
    const [isSecure, setSecureTextEntry] = useState(secureTextEntry);

    return (
        <View style={StyleSheet.compose(styles.container, style)}>
            <Text style={styles.label}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    placeholder={placeholder}
                    style={styles.input}
                    secureTextEntry={isSecure}
                    placeholderTextColor="gray"
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    keyboardType={isNumber ? 'numeric' : 'default'}
                />
                {secureTextEntry && (
                    <Pressable
                        onPress={() => setSecureTextEntry(!isSecure)}
                        style={styles.pressable}
                    >
                        {isSecure ? (
                            <AntDesign name="eye" size={24} color="gray" />
                        ) : (
                            <AntDesign name="eye-invisible" size={24} color="gray" />
                        )}
                    </Pressable>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
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
    },
    pressable: {
        position: 'absolute',
        right: 10,
    },
    error: {
        color: Colors.primary,
        marginTop: 5,
    },
});
