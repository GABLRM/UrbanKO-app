import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatchFight } from '@/hooks/usePatchFight';
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

describe('usePatchFight', () => {
    const mockToken = 'test-token';
    const mockPatchFightDto = {
        id: 'fight-123',
        location: 'Paris',
        date: new Date('2024-01-01'),
        winner: 'user-456',
        status: FightStatusEnum.FINISHED,
        image: 'https://example.com/image.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully patch a fight', async () => {
        const mockResponse = { success: true, fight: mockPatchFightDto };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => usePatchFight(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockPatchFightDto);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_API_URL}/fights/${mockPatchFightDto.id}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: mockPatchFightDto.location,
                    date: mockPatchFightDto.date,
                    winner: mockPatchFightDto.winner,
                    image: mockPatchFightDto.image,
                }),
            },
        );
        expect(result.current.data).toEqual(mockResponse);
    });
});
