import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useValidateFight } from '@/hooks/useValidateFight';
import * as SecureStore from 'expo-secure-store';
import { FightStatusEnum } from '@/type/fight';

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

describe('useValidateFight', () => {
    const mockToken = 'test-token';
    const mockValidateFightDto = {
        fightId: 'fight-123',
        status: FightStatusEnum.ACCEPTED,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully validate a fight', async () => {
        const mockResponse = { success: true, fight: mockValidateFightDto };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useValidateFight(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockValidateFightDto);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_API_URL}/fights/accept/${mockValidateFightDto.fightId}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        expect(result.current.data).toEqual(mockResponse);
    });
});
