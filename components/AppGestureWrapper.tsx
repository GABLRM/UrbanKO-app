import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useState } from 'react';
import EasterEggModal from '@/components/EasterEggModal';

export default function AppGestureWrapper({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    const easterEgg = Gesture.Tap()
        .numberOfTaps(4)
        .runOnJS(true)
        .onStart(() => {
            setIsVisible(true);
        });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={easterEgg}>
                <View style={{ flex: 1 }}>{children}</View>
            </GestureDetector>
            <EasterEggModal isVisible={isVisible} setIsVisible={setIsVisible} />
        </GestureHandlerRootView>
    );
}
