import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import { Redirect, Tabs } from 'expo-router';
import { Map, Swords, Trophy, User } from 'lucide-react-native';

export default function TabsLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!user) return <Redirect href={'/(auth)'} />;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.secondary,
                tabBarStyle: {
                    backgroundColor: Colors.background,
                    paddingTop: 20,
                    height: 100,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <Map color={color} size={28} />,
                    tabBarLabelStyle: { fontSize: 14, marginTop: 5 },
                }}
            />
            <Tabs.Screen
                name="ranking"
                options={{
                    title: 'Top',
                    tabBarIcon: ({ color }) => <Trophy color={color} size={28} />,
                    tabBarLabelStyle: { fontSize: 14, marginTop: 5 },
                }}
            />
            <Tabs.Screen
                name="match"
                options={{
                    title: 'Match',
                    tabBarIcon: ({ color }) => <Swords color={color} size={28} />,
                    tabBarLabelStyle: { fontSize: 14, marginTop: 5 },
                }}
            />
            <Tabs.Screen
                name="profile/[id]"
                options={{
                    title: 'Profil',
                    href: {
                        pathname: '/profile/[id]',
                        params: { id: user._id },
                    },
                    tabBarIcon: ({ color }) => <User color={color} size={28} />,
                    tabBarLabelStyle: { fontSize: 14, marginTop: 5 },
                }}
            />
        </Tabs>
    );
}
