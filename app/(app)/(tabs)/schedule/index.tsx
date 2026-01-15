import { useAuth } from '@/contexts/AuthenticationContext';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fight } from '@/type/fight';
import { Loader } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { useGetFights } from '@/hooks/useGetFights';
import { useGetFightsMe } from '@/hooks/useGetFightsMe';
import FightComponent from '@/features/fights/fight';
import { useFocusEffect } from 'expo-router';

export default function SchedulePage() {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'self'>('all');
    const [fights, setFights] = useState<Fight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useAuth();

    const getFightsMutation = useGetFights();
    const getFightsMeMutation = useGetFightsMe();

    const getFights = () => {
        getFightsMutation.mutate(undefined, {
            onSuccess: (fights: Fight[]) => {
                setFights(fights);
                setIsLoading(false);
            },
            onError: (error: Error) => {
                console.error(error);
                setFights([]);
                setIsLoading(false);
            },
        });
    };

    const getMeFights = () => {
        getFightsMeMutation.mutate(undefined, {
            onSuccess: (fights: Fight[]) => {
                setFights(fights);
                setIsLoading(false);
            },
            onError: (error: Error) => {
                console.error(error);
                setFights([]);
                setIsLoading(false);
            },
        });
    };

    const fetchFights = () => {
        setIsLoading(true);
        if (selectedFilter === 'all') {
            getFights();

            return;
        }

        getMeFights();
    };

    useFocusEffect(
        useCallback(() => {
            fetchFights();
        }, [selectedFilter]),
    );

    if (!user) {
        return null;
    }

    return (
        <View style={styles.pageContainer}>
            <ScrollView
                style={styles.fightsContainer}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: isLoading ? 'center' : 'flex-start',
                    paddingTop: 20,
                }}
            >
                {isLoading ? (
                    <View
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Loader />
                    </View>
                ) : (
                    <View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            <Pressable
                                style={[
                                    styles.chip,
                                    styles.chipSmallSize,
                                    selectedFilter === 'all' && styles.chipActive,
                                ]}
                                onPress={() => setSelectedFilter('all')}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedFilter === 'all' && styles.chipTextActive,
                                    ]}
                                >
                                    Tous
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.chip,
                                    styles.chipLargeSize,
                                    selectedFilter === 'self' && styles.chipActive,
                                ]}
                                onPress={() => setSelectedFilter('self')}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedFilter === 'self' && styles.chipTextActive,
                                    ]}
                                >
                                    Mes combats
                                </Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 1, gap: 20, paddingHorizontal: 10, paddingTop: 20 }}>
                            {fights?.length ? (
                                fights.map((fight: Fight, index: number) => (
                                    <FightComponent
                                        key={index}
                                        fight={fight}
                                        getFights={fetchFights}
                                    />
                                ))
                            ) : (
                                <Text style={styles.noFight}>Aucun match trouvé</Text>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    fightsContainer: {
        backgroundColor: Colors.gray,
        borderRadius: 30,
        marginTop: 50,
        marginBottom: 20,
        width: '95%',
    },
    noFight: {
        alignSelf: 'center',
        color: Colors.white,
    },
    chip: {
        borderRadius: 16,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 32,
    },
    chipSmallSize: {
        width: 60,
    },
    chipLargeSize: {
        width: 150,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        color: Colors.secondary,
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: Colors.white,
    },
});
