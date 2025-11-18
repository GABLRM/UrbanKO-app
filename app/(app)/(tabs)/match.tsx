import { StyleSheet, Text, View } from 'react-native';

export default function MatchPage() {
    return (
        <View style={styles.container}>
            <Text>Match Page</Text>
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
