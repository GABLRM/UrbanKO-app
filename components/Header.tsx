import { Colors } from '@/constants/Colors';
import { Flame, Swords } from 'lucide-react-native';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type HeaderProps = {
    style?: StyleProp<ViewStyle>;
};

export default function Header({ style }: HeaderProps) {
    return (
        <View style={StyleSheet.compose(styles.container, style)}>
            <View style={styles.headerContainer}>
                <Swords color={Colors.primary} size={60} />
                <Flame color={Colors.primary} size={60} />
            </View>
            <Text style={styles.headerTitle}>Urban KO</Text>
            <Text style={styles.headerSubtitle}>Trouve ton adversaire et met le KO</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 40,
    marginTop: 5,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: Colors.secondary,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
  },
});
