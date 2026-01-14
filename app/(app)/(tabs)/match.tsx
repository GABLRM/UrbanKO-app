import { Colors } from '@/constants/Colors';
import MatchmakingChoice from '@/features/matchmaking/MatchmakingChoice';
import MatchmakingHeader from '@/features/matchmaking/MatchmakingHeader';
import MatchmakingOpponentCard from '@/features/matchmaking/MatchmakingOpponentCard';
import { useGetMatchmaking } from '@/hooks/useGetMatchmaking';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MatchPage() {
    const { data } = useGetMatchmaking();

    const opponent = data?.results[0];

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <MatchmakingHeader />
            </SafeAreaView>

            <View style={styles.opponentContainer}>
                <MatchmakingOpponentCard opponent={opponent} />
            </View>

            <View style={styles.choiceContainer}>
                <MatchmakingChoice />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.background,
        width: '100%',
    },

    opponentContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    choiceContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
