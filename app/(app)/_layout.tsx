import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthenticationContext';
import { ActivityIndicator } from 'react-native';

export default function AppLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <ActivityIndicator color="red" size={'large'} />;
    }

    if (!user) return <Redirect href={'/(auth)'} />;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
