import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';
import RankingCard from '@/features/ranking/RankingCard';
import { Disciplines } from '@/enums/disciplines';
import { useState } from 'react';
import { useRanking } from '@/hooks/useRanking';

const disciplineFilters = [
    { label: 'Tous', value: null },
    { label: Disciplines.BOXING, value: Disciplines.BOXING },
    { label: Disciplines.MMA, value: Disciplines.MMA },
    { label: Disciplines.JUDO, value: Disciplines.JUDO },
    { label: Disciplines.KARATE, value: Disciplines.KARATE },
    { label: Disciplines.STREET_FIGHTING, value: Disciplines.STREET_FIGHTING },
    { label: Disciplines.TAEKWONDO, value: Disciplines.TAEKWONDO },
];

export default function RankingPage() {
    const [selectedDiscipline, setSelectedDiscipline] = useState<Disciplines | null>(null);
    const { data: users, isLoading, error } = useRanking(selectedDiscipline);

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="🏆Classement" subtitle="Les meilleurs combatants du moment" />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                {disciplineFilters.map((filter) => (
                    <Pressable
                        key={filter.label}
                        style={[
                            styles.chip,
                            selectedDiscipline === filter.value && styles.chipActive,
                        ]}
                        onPress={() => setSelectedDiscipline(filter.value)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                selectedDiscipline === filter.value && styles.chipTextActive,
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <ScrollView style={styles.cardContainer} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Chargement du classement...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>
                            Erreur lors du chargement du classement
                        </Text>
                    </View>
                ) : !users || users.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>
                            {selectedDiscipline
                                ? `Aucun combattant dans la catégorie ${selectedDiscipline}`
                                : 'Aucun combattant disponible'}
                        </Text>
                    </View>
                ) : (
                    users.map((user, index) => (
                        <RankingCard key={user._id} user={user} rank={index + 1} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
    },
    filtersContainer: {
        marginBottom: 15,
        minHeight: 45,
    },
    filtersContent: {
        gap: 10,
        paddingVertical: 5,
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
    cardContainer: {
        height: '100%',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
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
    emptyText: {
        color: Colors.secondary,
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
