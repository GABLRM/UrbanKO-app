import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import UserBattleInformation from '@/features/profile/UserBattleInformation';
import UserInformation from '@/features/profile/UserInformation';
import UserSubInformation from '@/features/profile/UserSubInformation';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUserById } from '@/hooks/useUserById';
import { ChevronLeft } from 'lucide-react-native';

export default function RankingUserProfile() {
    const router = useRouter();
    const { id }: { id: string } = useLocalSearchParams();
    const { user: currentUser } = useAuth();

    const { data: profileUser, isLoading, error } = useUserById(id);

    if (!currentUser) {
        return <Redirect href={'/(auth)'} />;
    }

    if (isLoading) {
        return (
            <SafeAreaProvider style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Chargement du profil...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    if (error || !profileUser) {
        return (
            <SafeAreaProvider style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Erreur lors du chargement du profil</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ChevronLeft color={Colors.white} size={32} />
                </Pressable>
            </View>
            <Image
                source={
                    profileUser?.image
                        ? { uri: profileUser.image }
                        : require('@/assets/images/default-avatar.jpg')
                }
                style={styles.profilePicture}
            />
            <View style={{ height: 70 }} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <UserInformation username={profileUser.username} city={profileUser.city} />
                <UserBattleInformation
                    score={profileUser.score}
                    victories={profileUser.victories}
                    defeats={profileUser.defeats}
                />
                <UserSubInformation
                    gender={profileUser.gender}
                    age={profileUser.age}
                    height={profileUser.height}
                    weight={profileUser.weight}
                    disciplines={profileUser.disciplines}
                />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.secondary,
        fontSize: 16,
        marginTop: 15,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
