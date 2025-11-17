import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

export default function Card({children}: {children: React.ReactNode}) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 20,
    padding: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.secondary,
    backgroundColor: Colors.card,
  },
});
