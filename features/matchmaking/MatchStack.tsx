import SwipableCard from '@/components/SwipableCard';
import MatchmakingOpponentCard from '@/features/matchmaking/MatchmakingOpponentCard';
import User from '@/type/user';
import { StyleSheet, View } from 'react-native';

interface MatchStackProps {
    opponents: User[];
    onLike: () => void;
    onDislike: () => void;
}

export default function MatchStack({ opponents, onLike, onDislike }: MatchStackProps) {
    return (
        <View style={styles.stackContainer}>
            {opponents.map((opponent, index) => (
                <View
                    key={opponent._id}
                    style={[
                        styles.cardWrapper,
                        {
                            zIndex: opponents.length - index,
                        },
                    ]}
                >
                    <SwipableCard onLike={onLike} onDislike={onDislike}>
                        <MatchmakingOpponentCard opponent={opponent} />
                    </SwipableCard>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    stackContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400, // ou la hauteur de ta card
    },
    cardWrapper: {
        position: 'absolute', // empile les cartes
        width: '100%',
    },
});
