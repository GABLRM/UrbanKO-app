import { StyleSheet, Text, View } from 'react-native';

type userBattleInformationProps = {
    score: number;
    victories: number;
    defeats: number;
};

export default function UserBattleInformation({
    score,
    victories,
    defeats,
}: userBattleInformationProps) {
    return (
        <View style={styles.battleInfoListContainer}>
            <View style={styles.battleInfoContainer}>
                <Text style={styles.battleInfo}>{score}</Text>
                <Text style={styles.battleInfoTitle}>Points</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text style={styles.battleInfo}>#12</Text>
                <Text style={styles.battleInfoTitle}>Classement</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text
                    style={{
                        ...styles.battleInfo,
                        color: '#01c851',
                    }}
                >
                    {victories}
                </Text>
                <Text style={styles.battleInfoTitle}>Victoires</Text>
            </View>
            <View style={styles.battleInfoContainer}>
                <Text style={{ ...styles.battleInfo, color: '#ce2626' }}>{defeats}</Text>
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
        backgroundColor: '#252529',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 20,
    },
    battleInfo: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#3b3fac',
        fontSize: 25,
    },
    battleInfoTitle: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#808995',
    },
});
