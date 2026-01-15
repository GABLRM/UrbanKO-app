import PageHeader from '@/components/PageHeader';
import { Colors } from '@/constants/Colors';
import MatchmakingChoice from '@/features/matchmaking/MatchmakingChoice';
import MatchStack from '@/features/matchmaking/MatchStack';
import MatchSuccess from '@/features/matchmaking/MatchSuccess';
import { useGetMatchmaking } from '@/hooks/useGetMatchmaking';
import { useSwipe } from '@/hooks/useSwipe';
import User from '@/type/user';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MatchPage() {
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const { data, isLoading, isFetching } = useGetMatchmaking({ cursor });
    const [opponents, setOpponents] = useState<User[]>([]);
    const [showMatch, setShowMatch] = useState(false);
    const lastCursorRef = useRef<string | undefined>(undefined);
    const prefetchingRef = useRef(false);

    const { mutate: swipe } = useSwipe();

    // Gérer les résultats de l'API
    useEffect(() => {
        if (!data?.results) return;

        if (!cursor) {
            // Premier chargement sans cursor - initialiser la liste
            setOpponents(data.results);
            lastCursorRef.current = undefined;
        } else if (cursor !== lastCursorRef.current) {
            // Nouveau cursor - ajouter les nouveaux résultats en évitant les doublons
            setOpponents((prev) => {
                const existingIds = new Set(prev.map((o) => o._id));
                const newOpponents = data.results.filter((o: User) => !existingIds.has(o._id));
                return [...prev, ...newOpponents];
            });
            lastCursorRef.current = cursor;
            prefetchingRef.current = false;
        }
    }, [data?.results, cursor]);

    const prefetchIfNeeded = () => {
        if (
            opponents.length <= 2 &&
            data?.nextCursor &&
            !isFetching &&
            !prefetchingRef.current &&
            cursor !== data.nextCursor
        ) {
            prefetchingRef.current = true;
            setCursor(data.nextCursor);
        }
    };

    const handleNextOpponent = () => {
        setOpponents((prev) => prev.slice(1));
        prefetchIfNeeded();
    };

    const handleLike = () => {
        swipe(
            { targetId: opponents[0]?._id, action: 'fight' },
            {
                onSuccess: (response) => {
                    if (response.match) {
                        setShowMatch(true);
                    }
                },
            },
        );
        handleNextOpponent();
    };

    const handleDislike = () => {
        swipe({ targetId: opponents[0]?._id, action: 'flee' });
        handleNextOpponent();
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <PageHeader title="💥 Matchmaking" subtitle="Swipe pour trouver ton adversaire" />
            </SafeAreaView>

            <MatchSuccess visible={showMatch} onHide={() => setShowMatch(false)} />

            {!opponents.length && !isLoading ? (
                <View style={styles.noOpponents}>
                    <Text style={{ color: Colors.secondary, fontSize: 18, fontWeight: 'bold' }}>
                        Aucun adversaire disponible
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.opponentContainer}>
                        <MatchStack
                            opponents={opponents}
                            onLike={handleLike}
                            onDislike={handleDislike}
                        />
                    </View>

                    <View style={styles.choiceContainer}>
                        <MatchmakingChoice onLike={handleLike} onDislike={handleDislike} />
                    </View>
                </>
            )}
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

    noOpponents: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    opponentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    choiceContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
