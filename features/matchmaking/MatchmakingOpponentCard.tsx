import Card from '@/components/Card';
import { Colors } from '@/constants/Colors';
import { Disciplines, getDisciplineLabel } from '@/enums/disciplines';
import User from '@/type/user';
import { hexWithOpacity } from '@/utils/colorsUtils';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

interface MatchmakingOpponentCardProps {
    opponent: User;
}

export default function MatchmakingOpponentCard({ opponent }: MatchmakingOpponentCardProps) {
    return (
        <Card style={styles.card}>
            <ImageBackground
                source={{
                    uri: opponent?.image,
                }}
                style={styles.image}
                imageStyle={styles.imageRounded}
            >
                <View style={styles.opponentInfosContainer}>
                    <Text style={styles.opponentName}>
                        {opponent?.username}, {opponent?.age}
                    </Text>

                    <View style={styles.specialtyBadgesContainer}>
                        {opponent?.disciplines?.map((discipline) => {
                            const d = discipline as keyof typeof Disciplines;
                            return (
                                <View key={d} style={styles.specialtyBadge}>
                                    <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                                        {getDisciplineLabel(d)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.badgesRow}>
                        <View style={styles.badgeHalf}>
                            <Text style={styles.badgeTitle}>Poids</Text>
                            <Text style={styles.badgeText}>💪 {opponent?.weight} kg</Text>
                        </View>

                        <View style={styles.badgeHalf}>
                            <Text style={styles.badgeTitle}>Taille</Text>
                            <Text style={styles.badgeText}>📏 {opponent?.height} cm</Text>
                        </View>
                    </View>

                    <View style={styles.badgeFull}>
                        <Text style={styles.badgeTitle}>Ratio</Text>
                        <Text style={styles.badgeText}>
                            🏆 {opponent?.victories}W - {opponent?.defeats}L
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 0,
        borderWidth: 0,
    },

    image: {
        width: '100%',
        height: 400,
        justifyContent: 'flex-end',
    },

    imageRounded: {
        borderRadius: 20,
    },

    opponentInfosContainer: {
        height: '60%',
        padding: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'flex-end',
    },

    opponentName: {
        color: Colors.white,
        textShadowColor: Colors.primary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 10,
    },

    specialtyBadgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },

    specialtyBadge: {
        alignSelf: 'flex-start',
        borderColor: Colors.primary,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        marginBottom: 10,
    },

    badgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginBottom: 10,
    },

    badgeHalf: {
        flex: 1,
        backgroundColor: hexWithOpacity(Colors.gray, 0.7),
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
    },

    badgeFull: {
        backgroundColor: hexWithOpacity(Colors.gray, 0.7),
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
    },

    badgeTitle: {
        color: Colors.secondary,
        fontSize: 14,
        marginBottom: 2,
    },

    badgeText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
