import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    findNodeHandle,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

interface Options {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    options: Options[];
    placeholder?: string;
}

export function Select({ label, value, onChange, options, placeholder }: SelectProps) {
    const [open, setOpen] = useState(false);
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const selectRef = useRef<View>(null);

    const openDropdown = () => {
        const handle = findNodeHandle(selectRef.current);
        if (!handle) return;

        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            setLayout({ x: pageX, y: pageY, width, height });
            setOpen(true);
        });
    };

    return (
        <>
            {/* SELECT */}
            <View ref={selectRef}>
                {label && <Text style={styles.label}>{label}</Text>}

                <Pressable style={styles.select} onPress={openDropdown}>
                    <Text style={styles.valueText} numberOfLines={1}>
                        {value || placeholder || 'Sélectionner...'}
                    </Text>

                    <Ionicons name="chevron-down" size={20} color="#444" />
                </Pressable>
            </View>

            {/* DROPDOWN */}
            <Modal visible={open} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                    <View
                        style={[
                            styles.dropdown,
                            {
                                position: 'absolute',
                                top: layout.y + layout.height + 2,
                                left: layout.x,
                                width: layout.width,
                            },
                        ]}
                    >
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={styles.option}
                                onPress={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <Text style={{ color: Colors.white }}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },

    select: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.customGrey,
        borderRadius: 15,
        backgroundColor: Colors.inputBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    valueText: {
        fontSize: 18,
        color: Colors.white,
        flex: 1,
        minWidth: 0,
    },

    overlay: {
        flex: 1,
    },

    dropdown: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.customGrey,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.customGrey,
    },
});
