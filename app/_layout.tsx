import AppGestureWrapper from '@/components/AppGestureWrapper';
import { AuthProvider } from '@/contexts/AuthenticationContext';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

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
