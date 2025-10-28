import Card from "@/components/Card";
import { Colors } from "@/constants/Colors";
import { Disciplines } from "@/enums/disciplines";
import { Dumbbell } from "lucide-react-native";
import { useController, useFormContext } from "react-hook-form";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Step2Props {
  nextStep: () => void;
}

export default function Step2({ nextStep }: Step2Props) {
  const { control, trigger } = useFormContext();

  const {
    field: { value: selected, onChange },
    fieldState,
  } = useController({
    name: "disciplines",
    control,
    defaultValue: [],
  });

  const toggleDiscipline = (discipline: string) => {
    const updated = selected.includes(discipline)
      ? selected.filter((d: string) => d !== discipline)
      : [...selected, discipline];
    onChange(updated);

    if (fieldState.error) {
      trigger("disciplines");
    }
  };

  return (
    <Card>
      <View style={styles.imageContainer}>
        <Dumbbell color={Colors.primary} size={70} strokeWidth={1.25} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Quelle est ta discipline ?</Text>
        <Text style={styles.description}>
          Montre-nous ton style de combat 🥋
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        {Object.entries(Disciplines).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => toggleDiscipline(key)}
            style={[
              styles.button,
              selected.includes(key) && styles.buttonSelected,
            ]}
          >
            <Text
              style={{
                color: selected.includes(key) ? "white" : Colors.secondary,
                fontWeight: "600",
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {fieldState.error && (
        <Text style={styles.error}>{fieldState.error.message}</Text>
      )}

      <Button title="Suivant" onPress={nextStep} />
    </Card>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 100,
    padding: 10,
    backgroundColor: Colors.darkPrimary,
  },
  textContainer: {
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    marginTop: 10,
    gap: 5,
  },
  button: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonSelected: { backgroundColor: Colors.primary },
  error: { color: "red", textAlign: "center", marginTop: 10 },
});
