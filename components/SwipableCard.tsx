import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SwipableCardProps {
    children: React.ReactNode;
    onLike?: () => void;
    onDislike?: () => void;
}

export default function SwipableCard({ children, onLike, onDislike }: SwipableCardProps) {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
            rotate.value = e.translationX / 20;
        })
        .onEnd(() => {
            if (translateX.value > 120) {
                translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
                    if (onLike) runOnJS(onLike)();
                });
            } else if (translateX.value < -120) {
                translateX.value = withSpring(-SCREEN_WIDTH, {}, () => {
                    if (onDislike) runOnJS(onDislike)();
                });
            } else {
                translateX.value = withSpring(0);
                rotate.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, animatedStyle]}>{children}</Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    card: {
        width: SCREEN_WIDTH - 40,
        alignSelf: 'center',
    },
});
