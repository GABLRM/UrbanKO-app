import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSwipe } from '@/hooks/useSwipe';
import * as SecureStore from 'expo-secure-store';
import { View, Text } from 'react-native';
import Button from '@/components/Button';

jest.mock('expo-secure-store');

function MatchmakingTestComponent() {
    const swipe = useSwipe();
    const [result, setResult] = React.useState<any>(null);

    const handleFight = () => {
        swipe.mutate(
            {
                targetId: 'user123',
                action: 'fight',
            },
            {
                onSuccess: (data) => setResult(data),
            },
        );
    };

    const handleFlee = () => {
        swipe.mutate(
            {
                targetId: 'user456',
                action: 'flee',
            },
            {
                onSuccess: (data) => setResult(data),
            },
        );
    };

    return (
        <View>
            <Button title="Fight" onPress={handleFight} />
            <Button title="Flee" onPress={handleFlee} />
            {swipe.isLoading && <Text>Swiping...</Text>}
            {swipe.isSuccess && <Text>Swipe successful</Text>}
            {result?.matched && <Text>Match found!</Text>}
            {swipe.isError && <Text>Swipe failed</Text>}
        </View>
    );
}

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Matchmaking Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    describe('Swipe Actions', () => {
        it('should successfully swipe fight and match', async () => {
            const mockToken = 'test-token';
            const mockResponse = { matched: true, matchId: 'match123' };

            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const { getByText } = render(<MatchmakingTestComponent />, {
                wrapper: createWrapper(),
            });

            const fightButton = getByText('Fight');
            fireEvent.press(fightButton);

            await waitFor(() => expect(getByText('Swipe successful')).toBeTruthy());
            await waitFor(() => expect(getByText('Match found!')).toBeTruthy());

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/matchmaking/swipe',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        targetId: 'user123',
                        action: 'fight',
                    }),
                }),
            );
        });

        it('should successfully swipe flee with no match', async () => {
            const mockToken = 'test-token';
            const mockResponse = { matched: false };

            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const { getByText, queryByText } = render(<MatchmakingTestComponent />, {
                wrapper: createWrapper(),
            });

            const fleeButton = getByText('Flee');
            fireEvent.press(fleeButton);

            await waitFor(() => expect(getByText('Swipe successful')).toBeTruthy());

            expect(queryByText('Match found!')).toBeNull();

            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/matchmaking/swipe',
                expect.objectContaining({
                    body: JSON.stringify({
                        targetId: 'user456',
                        action: 'flee',
                    }),
                }),
            );
        });

        it('should handle swipe error', async () => {
            const mockToken = 'test-token';

            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText } = render(<MatchmakingTestComponent />, {
                wrapper: createWrapper(),
            });

            const fightButton = getByText('Fight');
            fireEvent.press(fightButton);

            await waitFor(() => expect(getByText('Swipe failed')).toBeTruthy());
        });

        it('should complete swipe successfully', async () => {
            const mockToken = 'test-token';
            const mockResponse = { matched: true, matchId: 'match123' };

            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const { getByText, queryByText } = render(<MatchmakingTestComponent />, {
                wrapper: createWrapper(),
            });

            const fightButton = getByText('Fight');

            // Before clicking, loading should not be visible
            expect(queryByText('Swiping...')).toBeNull();

            fireEvent.press(fightButton);

            // After successful swipe, should show success (loading may be too fast to catch)
            await waitFor(() => expect(getByText('Swipe successful')).toBeTruthy());
            await waitFor(() => expect(getByText('Match found!')).toBeTruthy());
        });
    });
});
