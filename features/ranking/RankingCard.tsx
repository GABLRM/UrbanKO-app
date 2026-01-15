import { Colors } from '@/constants/Colors';
import User from '@/type/user';
import { Award, Crown, Medal, Trophy } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type RankingCardProps = {
    user: User;
    rank: number;
    onPress: () => void;
};

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <Trophy color="yellow" size={25} />;
        case 2:
            return <Medal color={Colors.secondary} size={25} />;
        case 3:
            return <Award color={Colors.primary} size={25} />;
        default:
            return <Text style={styles.rankText}>#{rank}</Text>;
    }
};

export default function RankingCard({ user, rank, onPress }: RankingCardProps) {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            {getRankIcon(rank)}
            <Image
                style={styles.picture}
                source={
                    user.image ? { uri: user.image } : require('@/assets/images/default-avatar.jpg')
                }
                width={40}
                height={40}
            />
            <View style={styles.userInformation}>
                <View style={styles.usernameContainer}>
                    <Text style={styles.username}>{user.username}</Text>
                    {rank === 1 && <Crown color="gold" size={16} style={styles.crownIcon} />}
                </View>
                <View style={styles.userCombatInformation}>
                    {user.disciplines && user.disciplines.length > 0 && (
                        <Text style={styles.userDiscipline}>{user.disciplines[0]}</Text>
                    )}
                    <Text style={styles.userRecord}>
                        {user.victories}W - {user.defeats}L
                    </Text>
                </View>
            </View>
            <Text style={styles.userScore}>{user.score}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        backgroundColor: Colors.card,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: Colors.primary,
        marginBottom: 8,
        alignItems: 'center',
        flexDirection: 'row',
    },
    rankText: {
        color: Colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    picture: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.primary,
        marginLeft: 15,
    },
    userInformation: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crownIcon: {
        marginLeft: 5,
    },
    username: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    userCombatInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    userDiscipline: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.white,
        borderWidth: 0.5,
        borderRadius: 15,
        borderColor: Colors.primary,
        paddingHorizontal: 7,
        paddingVertical: 5,
        marginRight: 10,
    },
    userRecord: {
        flexDirection: 'row',
        color: Colors.secondary,
        fontSize: 12,
    },
    userScore: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.primary,
    },
});
