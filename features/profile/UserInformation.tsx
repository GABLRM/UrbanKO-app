import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

type userInformationProps = {
    username: string;
    city: string;
};

export default function UserInformation({ username, city }: userInformationProps) {
    return (
        <View style={styles.firstUserInfoContainer}>
            <Text style={styles.userName}>{username}</Text>
            <View style={styles.cityContainer}>
                <FontAwesome6 name="location-dot" size={20} color="grey" />
                <Text style={styles.city}>{city}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    firstUserInfoContainer: {
        paddingLeft: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    userName: {
        color: 'white',
        fontSize: 25,
        paddingLeft: 15,
        width: '60%',
    },
    cityContainer: {
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    city: {
        color: 'grey',
        fontSize: 15,
        paddingLeft: 5,
    },
});
