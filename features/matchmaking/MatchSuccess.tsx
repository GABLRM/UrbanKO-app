import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface MatchSuccessProps {
    visible: boolean;
    onHide: () => void;
}

export default function MatchSuccess({ visible, onHide }: MatchSuccessProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);
    const rotate = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 100 });
            scale.value = withTiming(1, { duration: 100 });

            rotate.value = withRepeat(
                withSequence(withTiming(-10, { duration: 150 }), withTiming(10, { duration: 150 })),
                -1,
                true,
            );

            setTimeout(() => {
                opacity.value = withTiming(0, { duration: 300 }, () => {
                    runOnJS(onHide)();
                });

                scale.value = withTiming(0.5, { duration: 300 });
            }, 1800);
        }
    }, [visible]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const emojiStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate.value}deg` }],
    }));

    if (!visible) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]} pointerEvents="none">
            <BlurView intensity={60} tint="dark" style={styles.overlay}>
                <Animated.View style={[styles.centered, containerStyle]}>
                    <Animated.Text style={[styles.emoji, emojiStyle]}>🥊</Animated.Text>

                    <Text style={styles.title}>IT'S A FIGHT!</Text>
                    <Text style={styles.subtitle}>Un combat va bientôt être organisé 🔥</Text>
                </Animated.View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    centered: {
        alignItems: 'center',
        gap: 10,
    },
    emoji: {
        fontSize: 80,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#e63946', // primary
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
    },
});
