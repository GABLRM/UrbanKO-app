import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetFightsMe } from '@/hooks/useGetFightsMe';
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

describe('useGetFightsMe', () => {
    const mockToken = 'test-token';

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully get user fights', async () => {
        const mockMyFights = [
            { id: '1', fighter1: 'me', fighter2: 'user2' },
            { id: '2', fighter1: 'user3', fighter2: 'me' },
        ];
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockMyFights,
        });

        const { result } = renderHook(() => useGetFightsMe(), {
            wrapper: createWrapper(),
        });

        result.current.mutate();

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(`${process.env.EXPO_PUBLIC_API_URL}/fights/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${mockToken}`,
                'Content-Type': 'application/json',
            },
        });
        expect(result.current.data).toEqual(mockMyFights);
    });
});
