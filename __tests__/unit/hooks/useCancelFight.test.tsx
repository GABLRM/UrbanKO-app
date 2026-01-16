import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCancelFight } from '@/hooks/useCancelFight';
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

describe('useCancelFight', () => {
    const mockToken = 'test-token';
    const mockFightId = 'fight-123';

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully cancel a fight', async () => {
        const mockResponse = { success: true };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useCancelFight(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockFightId);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_API_URL}/fights/${mockFightId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle error when canceling fight fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
            text: async () => 'Fight not found',
        });

        const { result } = renderHook(() => useCancelFight(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockFightId);

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.error).toEqual(new Error('HTTP 404: Fight not found'));
    });
});
