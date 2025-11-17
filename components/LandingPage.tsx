import { Text, View } from 'react-native';
import { useGetMe } from '@/hooks/useGetMe';
import { useEffect } from 'react';
import { useUser } from '@/contexts/userContext';

export default function LandingPage() {
    const { status, data, error, isFetching } = useGetMe('token');
    const { updateUser } = useUser();

    useEffect(() => {
        if (!data) {
            return;
        }

        updateUser(data);
    }, [data, isFetching, updateUser]);

    return (
        <View>
            <Text>{status}</Text>
            <Text>{JSON.stringify(data)}</Text>
            <Text>{JSON.stringify(error)}</Text>
            <Text>{isFetching}</Text>
        </View>
    );
}
