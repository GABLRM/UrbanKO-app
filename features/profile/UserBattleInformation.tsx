import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

type userBattleInformationProps = {
    score: number;
    victories: number;
    defeats: number;
    ranking: number | string;
};

export default function UserBattleInformation({
    score,
    victories,
    defeats,
    ranking,
}: userBattleInformationProps) {
    return (
        <View style={styles.battleInfoListContainer}>
            <View style={styles.battleInfoContainer}>
                <Text style={styles.battleInfo}>{score}</Text>
                <Text style={styles.battleInfoTitle}>Points</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text style={styles.battleInfo}>{ranking ?? '-'}</Text>
                <Text style={styles.battleInfoTitle}>Classement</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text
                    style={{
                        ...styles.battleInfo,
                        color: Colors.green,
                    }}
                >
                    {victories}
                </Text>
                <Text style={styles.battleInfoTitle}>Victoires</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text style={{ ...styles.battleInfo, color: Colors.primary }}>{defeats}</Text>
                <Text style={styles.battleInfoTitle}>Défaites</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    battleInfoListContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        width: '100%',
        height: 200,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    battleInfoContainer: {
        width: '48%',
        height: '45%',
        backgroundColor: Colors.card,
        justifyContent: 'center',
        borderStyle: 'solid',
        borderColor: Colors.customGrey,
        borderWidth: 1,
        borderRadius: 20,
    },
    battleInfo: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.battleInfo,
        fontSize: 25,
    },
    battleInfoTitle: {
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.customGrey,
    },
});
