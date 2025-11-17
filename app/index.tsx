import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from '@/components/LandingPage';

const queryClient = new QueryClient({});

export default function Index() {
    const userId = 1;

    return (
        <QueryClientProvider client={queryClient}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LandingPage />
                <Link
                    href={{
                        pathname: '/profile/[id]',
                        params: { id: userId },
                    }}
                >
                    profile
                </Link>
                <Text>test</Text>
            </View>
        </QueryClientProvider>
    );
}
