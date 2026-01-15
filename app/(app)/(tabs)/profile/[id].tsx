import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import UserBattleInformation from '@/features/profile/UserBattleInformation';
import UserInformation from '@/features/profile/UserInformation';
import UserSubInformation from '@/features/profile/UserSubInformation';
import { useGetUser } from '@/hooks/useGetUser';
import User from '@/type/user';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChevronLeft, LogOut } from 'lucide-react-native';

export default function Id() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();
    const { id }: { id: string } = useLocalSearchParams();
    const { user, logout } = useAuth();
    const [isSelfProfile, setIsSelfProfile] = useState(false);
    const getUserMutation = useGetUser();

    useEffect(() => {
        setIsSelfProfile(id === user?._id);
    }, [id, user?._id]);

    useEffect(() => {
        if (!id && !currentUser) {
            return;
        }

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

    if (!currentUser) {
        return <View />;
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header}>
                {!isSelfProfile ? (
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.push('/(app)/(tabs)/ranking')}
                    >
                        <ChevronLeft color={Colors.white} size={32} />
                    </Pressable>
                ) : (
                    <View />
                )}
                <View style={styles.logOutButton}>
                    <Pressable style={styles.backButton} onPress={() => logout()}>
                        <LogOut color={Colors.white} size={32} />
                    </Pressable>
                </View>
            </View>
            <Image
                source={
                    currentUser.image
                        ? { uri: currentUser.image }
                        : require('@/assets/images/default-avatar.jpg')
                }
                style={styles.profilePicture}
            />
            <View style={{ height: 70 }} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <UserInformation username={currentUser.username} city={currentUser.city} />
                <UserBattleInformation
                    score={currentUser.score}
                    victories={currentUser.victories}
                    defeats={currentUser.defeats}
                />
                <UserSubInformation
                    gender={currentUser.gender}
                    age={currentUser.age}
                    height={currentUser.height}
                    weight={currentUser.weight}
                    disciplines={currentUser.disciplines}
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
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        height: 150,
        width: '100%',
        backgroundColor: Colors.primary,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 60,
        paddingLeft: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logOutButton: {
        alignSelf: 'flex-end',
        paddingRight: 10,
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
