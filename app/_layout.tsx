import AppGestureWrapper from '@/components/AppGestureWrapper';
import { AuthProvider } from '@/contexts/AuthenticationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

export default function RootLayout() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <AppGestureWrapper>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(app)" />
                    </Stack>
                </AppGestureWrapper>
            </QueryClientProvider>
        </AuthProvider>
    );
}
