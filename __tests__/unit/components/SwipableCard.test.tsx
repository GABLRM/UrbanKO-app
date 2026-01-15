import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import SwipableCard from '@/components/SwipableCard';

// Wrap children in View to avoid gesture handler testing issues
const TestContent = ({ text }: { text: string }) => (
    <View>
        <Text>{text}</Text>
    </View>
);

describe('SwipableCard Component', () => {
    const mockOnLike = jest.fn();
    const mockOnDislike = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render children', () => {
        const { getByText } = render(
            <SwipableCard>
                <TestContent text="Test Content" />
            </SwipableCard>,
        );
        expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render with onLike callback', () => {
        const { getByText } = render(
            <SwipableCard onLike={mockOnLike}>
                <TestContent text="Card with Like" />
            </SwipableCard>,
        );
        expect(getByText('Card with Like')).toBeTruthy();
    });

    it('should render with onDislike callback', () => {
        const { getByText } = render(
            <SwipableCard onDislike={mockOnDislike}>
                <TestContent text="Card with Dislike" />
            </SwipableCard>,
        );
        expect(getByText('Card with Dislike')).toBeTruthy();
    });

    it('should render with both callbacks', () => {
        const { getByText } = render(
            <SwipableCard onLike={mockOnLike} onDislike={mockOnDislike}>
                <TestContent text="Card with Both" />
            </SwipableCard>,
        );
        expect(getByText('Card with Both')).toBeTruthy();
    });

    it('should render without callbacks', () => {
        const { getByText } = render(
            <SwipableCard>
                <TestContent text="Card without callbacks" />
            </SwipableCard>,
        );
        expect(getByText('Card without callbacks')).toBeTruthy();
    });
});
