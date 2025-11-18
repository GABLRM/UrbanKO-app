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
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                {/* <LandingPage /> */}
                <Link
                    href={{
                        pathname: '/profile/[id]',
                        params: { id: userId },
                    }}
                >
                    profile
                </Link>
                <Link href="/(auth)">auth</Link>
                <Link href="/onboarding">onboarding</Link>
            </View>
        </QueryClientProvider>
    );
}
