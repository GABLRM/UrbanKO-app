import LandingPage from '@/components/LandingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { View } from 'react-native';

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
                <Link href="/onboarding">onboarding</Link>
                <Link href="/(auth)">Connexion</Link>
            </View>
        </QueryClientProvider>
    );
}
