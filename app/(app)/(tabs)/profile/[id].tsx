import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import UserBattleInformation from '@/features/profile/UserBattleInformation';
import UserInformation from '@/features/profile/UserInformation';
import UserSubInformation from '@/features/profile/UserSubInformation';
import { useGetUser } from '@/hooks/useGetUser';
import User from '@/type/user';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Id() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();
    const { id }: { id: string } = useLocalSearchParams();
    const { user } = useAuth();
    const [isSelfProfile, setIsSelfProfile] = useState(false);
    const getUserMutation = useGetUser();

    useEffect(() => {
        setIsSelfProfile(id === user?._id);
    }, [id, user?._id]);

    useEffect(() => {
        if (id === user?._id) {
            setCurrentUser(user);

            return;
        }

        getUserMutation.mutate(id, {
            onSuccess: (user: User) => {
                setCurrentUser(user);
            },
            onError: (error: Error) => {
                console.error(error);
            },
        });
    }, [id, user?._id]);

    if (!user) {
        return <Redirect href={'/(auth)'} />;
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header} />
            <Image
                source={
                    user.image
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
                {isSelfProfile && (
                    <View style={styles.modifyProfileButtonContainer}>
                        <View style={styles.modifyProfileButton}>
                            <Button
                                title={'Modifier le profil'}
                                color={Colors.white}
                                onPress={() => router.push('/(app)/(modals)/profileEditionModal')}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: Colors.background,
    },
    header: {
        height: 150,
        width: '100%',
        backgroundColor: Colors.primary,
    },
    profilePicture: {
        width: 100,
        height: 100,
        top: 105,
        left: 50,
        borderRadius: 100,
        borderColor: Colors.black,
        borderWidth: 5,
        position: 'absolute',
    },
    modifyProfileButtonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    modifyProfileButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
    },
});
