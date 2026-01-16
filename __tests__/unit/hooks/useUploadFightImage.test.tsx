import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUploadFightImage } from '@/hooks/useUploadFightImage';
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

describe('useUploadFightImage', () => {
    const mockToken = 'test-token';
    const mockData = {
        fightId: 'fight-123',
        imageInfo: {
            uri: 'file:///path/to/image.jpg',
            name: 'image.jpg',
            mimetype: 'image/jpeg',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
        global.fetch = jest.fn();
    });

    it('should successfully upload a fight image', async () => {
        const mockImageUrl = 'https://example.com/uploads/image.jpg';
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => mockImageUrl,
        });

        const { result } = renderHook(() => useUploadFightImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
        expect(global.fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_API_URL}/fights/upload-image/${mockData.fightId}`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            }),
        );
        expect(result.current.data).toBe(mockImageUrl);
    });

    it('should replace localhost URL with API URL', async () => {
        const mockLocalUrl = 'http://localhost:3000/uploads/image.jpg';
        const expectedUrl = `${process.env.EXPO_PUBLIC_API_URL}/uploads/image.jpg`;

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => mockLocalUrl,
        });

        const { result } = renderHook(() => useUploadFightImage(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(mockData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBe(expectedUrl);
    });
});
