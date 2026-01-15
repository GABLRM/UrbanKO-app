import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swords } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fight, FightStatusEnum } from '@/type/fight';
import { useAuth } from '@/contexts/AuthenticationContext';
import { useRouter } from 'expo-router';
import { useValidateFight } from '@/hooks/useValidateFight';
import { useCancelFight } from '@/hooks/useCancelFight';

export default function FightComponent({
    fight,
    getFights,
}: {
    fight: Fight;
    getFights: () => void;
}) {
    const validateFightMutation = useValidateFight();
    const cancelFightMutation = useCancelFight();

    const { user } = useAuth();
    const router = useRouter();

    const getBackgroundColorByFightStatus = (fightStatus: FightStatusEnum) => {
        switch (fightStatus) {
            case FightStatusEnum.IN_PROGRESS:
                return Colors.primary;
            default:
                return Colors.inputBackground;
        }
    };

    const getFightStatusDescription = (fightStatus: FightStatusEnum) => {
        switch (fightStatus) {
            case FightStatusEnum.IN_PROGRESS:
                return 'en cours';
            case FightStatusEnum.TO_CONFIRMED:
                return 'à confirmé';
            case FightStatusEnum.PENDING:
                return 'en attente';
            case FightStatusEnum.CANCELLED:
                return 'annulé';
            case FightStatusEnum.TO_COME:
                return 'à venir';
            default:
                return 'terminé';
        }
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const cancelFight = () => {
        cancelFightMutation.mutate(fight._id, {
            onSuccess: () => {
                getFights();
            },
            onError: (error: Error) => {
                console.error(error);
            },
        });
    };

    const validateFight = () => {
        validateFightMutation.mutate(
            { fightId: fight._id, status: FightStatusEnum.TO_COME },
            {
                onSuccess: () => {
                    getFights();
                },
                onError: (error: Error) => {
                    console.error(error);
                },
            },
        );
    };

    return (
        <View
            style={{
                ...styles.fightContainer,
                backgroundColor: getBackgroundColorByFightStatus(fight.status),
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={
                            fight.contestant1.image
                                ? { uri: fight.contestant1.image }
                                : require('@/assets/images/default-avatar.jpg')
                        }
                        style={styles.profilePicture}
                    />
                    <Text style={{ ...styles.username, paddingLeft: 10 }}>
                        {fight.contestant1.username}
                    </Text>
                </View>
                <Swords color={Colors.white} size={30} />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ ...styles.username, paddingRight: 10 }}>
                        {fight.contestant2.username}
                    </Text>
                    <Image
                        source={
                            fight.contestant2.image
                                ? { uri: fight.contestant2.image }
                                : require('@/assets/images/default-avatar.jpg')
                        }
                        style={styles.profilePicture}
                    />
                </View>
            </View>
            {fight?.date && fight.location ? (
                <View style={{ paddingTop: 10 }}>
                    <Text style={styles.username}>{fight.location}</Text>
                    <Text style={styles.username}>{formatDate(new Date(fight.date))}</Text>
                </View>
            ) : (
                <View />
            )}
            <View style={{ paddingTop: 10 }}>
                <Text style={styles.username}>
                    Le combat est {getFightStatusDescription(fight.status)}
                </Text>
            </View>
            {fight?.winner && fight?.image ? (
                <View>
                    <Image source={{ uri: fight.image }} width={300} height={520} />
                </View>
            ) : (
                <View />
            )}
            {fight?.winner ? (
                <View style={{ paddingTop: 10 }}>
                    <Text style={styles.username}>Le gagnant est {fight.winner.username}</Text>
                </View>
            ) : (
                <View />
            )}
            {fight.contestant1._id === user?._id && fight.status === FightStatusEnum.PENDING ? (
                <Pressable
                    style={{ paddingTop: 10, alignSelf: 'center' }}
                    onPress={() =>
                        router.push({
                            pathname: '/(app)/(modals)/[fightId]',
                            params: {
                                fightId: fight._id,
                            },
                        })
                    }
                >
                    <View style={[styles.button, styles.largeButton]}>
                        <Text>Selectionner une date et un lieu</Text>
                    </View>
                </Pressable>
            ) : (
                <View />
            )}
            {fight.contestant2._id === user?._id &&
            fight.status === FightStatusEnum.TO_CONFIRMED ? (
                <View
                    style={{ paddingTop: 10, alignSelf: 'center', flexDirection: 'row', gap: 10 }}
                >
                    <Pressable onPress={() => cancelFight()}>
                        <View style={[styles.button, styles.smallButton]}>
                            <Text>Fuire le match</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={() => validateFight()}>
                        <View style={[styles.button, styles.smallButton]}>
                            <Text>Confirmer le match</Text>
                        </View>
                    </Pressable>
                </View>
            ) : (
                <View />
            )}
            {[fight.contestant2._id, fight.contestant1._id].includes(user?._id ?? '') &&
            fight.status === FightStatusEnum.IN_PROGRESS ? (
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: '/(app)/(modals)/confirmVictory/[fightId]',
                            params: { fightId: fight._id },
                        })
                    }
                    style={{ paddingTop: 10, alignSelf: 'center', flexDirection: 'row', gap: 10 }}
                >
                    <View
                        style={{
                            ...styles.button,
                            ...styles.largeButton,
                            backgroundColor: Colors.white,
                        }}
                    >
                        <Text>Confirmer votre victoire</Text>
                    </View>
                </Pressable>
            ) : (
                <View />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fightContainer: {
        borderRadius: 10,
        borderColor: Colors.black,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'column',
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 100,
        borderColor: Colors.black,
        borderWidth: 1,
    },
    username: {
        fontSize: 20,
        color: Colors.white,
    },
    button: {
        height: 30,
        backgroundColor: Colors.primary,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: Colors.black,
        borderWidth: 2,
    },
    largeButton: {
        height: 30,
        width: 300,
    },
    smallButton: {
        height: 30,
        width: 150,
    },
});
