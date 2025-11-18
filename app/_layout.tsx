import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/contexts/userContext';
import AppGestureWrapper from '@/components/AppGestureWrapper';
import { AuthProvider } from '@/contexts/AuthenticationContext';

const queryClient = new QueryClient({
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
                <UserProvider>
                    <AppGestureWrapper>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(auth)" />
                        </Stack>
                    </AppGestureWrapper>
                </UserProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}
