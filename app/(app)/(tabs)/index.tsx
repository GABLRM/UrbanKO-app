import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthenticationContext';

export default function TabsIndex() {
    const { logout } = useAuth();
    return (
        <View style={styles.container}>
            <Text>Tabs Index Screen</Text>
            <Button title={'logout'} onPress={() => logout()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
