import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

type PageHeaderProps = {
    title: string;
    subtitle: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerDescription}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: Colors.background,
        borderBottomColor: Colors.secondary,
        borderBottomWidth: 0.5,
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 24,
        color: Colors.primary,
    },

    headerDescription: {
        fontSize: 16,
        color: Colors.secondary,
    },
});
