import { StyleSheet, Text, View } from 'react-native';

export default function RankingPage() {
    return (
        <View style={styles.container}>
            <Text>Ranking Page</Text>
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
