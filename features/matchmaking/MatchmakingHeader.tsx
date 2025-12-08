import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchmakingHeader() {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>💥 Matchmaking</Text>
            <Text style={styles.headerDescription}>Swipe pour trouver ton adversaire</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        gap: 10,
        backgroundColor: Colors.card,
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 0.5,
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 24,
        color: Colors.primary,
    },

    headerDescription: {
        fontSize: 16,
        color: Colors.secondary,
    },
});
