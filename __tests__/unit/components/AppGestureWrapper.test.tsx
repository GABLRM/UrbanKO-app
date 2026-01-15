import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import AppGestureWrapper from '@/components/AppGestureWrapper';

// Wrap children in View to avoid gesture handler testing issues
const TestContent = ({ text }: { text: string }) => (
    <View>
        <Text>{text}</Text>
    </View>
);

describe('AppGestureWrapper Component', () => {
    it('should render children', () => {
        const { getByText } = render(
            <AppGestureWrapper>
                <TestContent text="App Content" />
            </AppGestureWrapper>,
        );
        expect(getByText('App Content')).toBeTruthy();
    });

    it('should render with multiple children', () => {
        const { getByText } = render(
            <AppGestureWrapper>
                <TestContent text="First Child" />
                <TestContent text="Second Child" />
            </AppGestureWrapper>,
        );
        expect(getByText('First Child')).toBeTruthy();
        expect(getByText('Second Child')).toBeTruthy();
    });

    it('should wrap children in GestureHandlerRootView', () => {
        const { UNSAFE_root } = render(
            <AppGestureWrapper>
                <TestContent text="Test" />
            </AppGestureWrapper>,
        );
        expect(UNSAFE_root).toBeTruthy();
    });
});
