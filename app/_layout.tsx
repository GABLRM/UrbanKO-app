import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/userContext';

export default function RootLayout() {
    return (
        <UserProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />

            </Stack>
        </UserProvider>
    );
}
