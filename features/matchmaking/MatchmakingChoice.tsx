import { Colors } from '@/constants/Colors';
import { Flame, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

interface MatchmakingChoiceProps {
    onLike: () => void;
    onDislike: () => void;
}

export default function MatchmakingChoice({ onLike, onDislike }: MatchmakingChoiceProps) {
    return (
        <View style={styles.choiceContainer}>
            <Pressable onPress={onDislike} style={styles.refusalChoice}>
                <X size={36} color={Colors.primary} />
            </Pressable>
            <Pressable onPress={onLike} style={styles.acceptChoice}>
                <Flame size={36} color={Colors.white} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    choiceContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 24,
    },

    refusalChoice: {
        backgroundColor: Colors.gray,
        borderRadius: 100,
        padding: 20,
    },

    acceptChoice: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        padding: 20,
    },
});
