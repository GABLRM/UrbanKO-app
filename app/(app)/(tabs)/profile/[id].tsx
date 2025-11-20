import { useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import UserInformation from '@/features/profile/UserInformation';
import UserBattleInformation from '@/features/profile/UserBattleInformation';
import UserSubInformation from '@/features/profile/UserSubInformation';
import User from '@/type/user';
import { useAuth } from '@/contexts/AuthenticationContext';

export default function Id() {
    // const [user, setUser] = useState<User | undefined>(undefined);
    const { id }: { id: string } = useLocalSearchParams();
    const { user } = useAuth();

    //todo: get user info if id !== user._id

    if (!user) {
        return <SafeAreaProvider />;
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header} />
            <Image
                source={
                    user?.image
                        ? { uri: user.image }
                        : require('../../../../assets/images/favicon.png')
                }
                style={styles.profilePicture}
            />
            <View style={{ height: 70 }} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <UserInformation username={user.username} city={user.city} />
                <UserBattleInformation
                    score={user.score}
                    victories={user.victories}
                    defeats={user.defeats}
                />
                <UserSubInformation
                    gender={user.gender}
                    age={user.age}
                    height={user.height}
                    weight={user.weight}
                    disciplines={user.disciplines}
                />
                <View style={styles.modifyProfileButtonContainer}>
                    <View style={styles.modifyProfileButton}>
                        <Button title={'Modifier le profil'} color={'white'} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#1a1a1f',
    },
    header: {
        height: 150,
        width: '100%',
        backgroundColor: '#ce2525',
    },
    profilePicture: {
        width: 100,
        height: 100,
        top: 105,
        left: 50,
        borderRadius: 100,
        borderColor: 'black',
        borderWidth: 5,
        position: 'absolute',
    },
    modifyProfileButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    modifyProfileButton: {
        backgroundColor: '#ce2525',
        borderRadius: 10,
    },
});
