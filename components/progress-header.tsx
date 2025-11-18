import { ThemedView } from "@/components/themed-view";
import { useRegister } from "@/contexts/RegisterContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ProgressHeader() {
    const { step, setStep } = useRegister();
    const primary = useThemeColor({}, "primary");

    const progress = step / 3;

    return (
        <ThemedView style={styles.header}>
            {step > 1 ? (
                <TouchableOpacity
                    onPress={() => setStep(step - 1)}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={22} />
                </TouchableOpacity>
            ) : (
                <View style={styles.backButton} />
            )}

            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${progress * 100}%`, backgroundColor: primary },
                    ]}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
    },
    progressContainer: {
        height: 6,
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: 50,
        overflow: "hidden",
        marginTop: 16,
    },
    progressFill: {
        height: "100%",
    },
});
