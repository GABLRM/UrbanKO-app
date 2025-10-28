import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
    const userId = 1;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
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
    );
}
