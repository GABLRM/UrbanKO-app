import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFinishFight } from '@/hooks/useFinishFight';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

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

describe('useFinishFight', () => {
    const mockToken = 'test-token';
    const mockPatchFightDto = {
        fightId: 'fight-123',
        winnerId: 'user-456',
        image: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully finish a fight', async () => {
        const mockResponse = { success: true, fight: mockPatchFightDto };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useFinishFight(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockPatchFightDto);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_API_URL}/fights/finish`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockPatchFightDto),
            },
        );
        expect(result.current.data).toEqual(mockResponse);
    });
});
