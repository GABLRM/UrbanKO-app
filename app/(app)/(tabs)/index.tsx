import { StyleSheet, Text, View } from 'react-native';

export default function TabsIndex() {
    return (
        <View style={styles.container}>
            <Text>Tabs Index Screen</Text>
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
