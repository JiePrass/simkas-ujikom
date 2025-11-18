import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface SectionProps {
    title: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
}

function FilterSection({ title, options, selected, onSelect }: SectionProps) {
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    return (
        <View style={{ marginBottom: 25 }}>
            <ThemedText type="subtitle" style={{ marginBottom: 12, fontSize: 16 }}>
                {title}
            </ThemedText>

            {options.map((option) => {
                const isSelected = selected === option;

                return (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onSelect(option)}
                        style={styles.optionRow}
                        activeOpacity={0.6}
                    >
                        <ThemedText style={[styles.optionText, { color: textColor }]}>
                            {option}
                        </ThemedText>

                        <View
                            style={[
                                styles.radioCircle,
                                {
                                    borderColor: isSelected ? primary : "#999",
                                },
                            ]}
                        >
                            {isSelected && (
                                <View
                                    style={[
                                        styles.radioInner,
                                        { backgroundColor: primary },
                                    ]}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;

    timeFilter: string;
    priceFilter: string;

    setTimeFilter: (value: string) => void;
    setPriceFilter: (value: string) => void;

    onApply: () => void;
}

export function FilterModal({
    visible,
    onClose,
    timeFilter,
    priceFilter,
    setTimeFilter,
    setPriceFilter,
    onApply,
}: FilterModalProps) {
    const background = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");

    return (
        <Modal visible={visible} transparent animationType="fade">
            {/* CLICK OUTSIDE AREA */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={[styles.modalContent, { backgroundColor: background }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FilterSection
                        title="Waktu"
                        options={["Semua", "Akan Datang", "Sudah Lewat"]}
                        selected={timeFilter}
                        onSelect={setTimeFilter}
                    />

                    <FilterSection
                        title="Harga"
                        options={[
                            "Semua",
                            "Gratis",
                            "< 20.000",
                            "20.000 - 50.000",
                            "50.000 - 100.000",
                            "> 100.000",
                        ]}
                        selected={priceFilter}
                        onSelect={setPriceFilter}
                    />
                </ScrollView>

                <TouchableOpacity style={[styles.applyButton, {backgroundColor: primary}]} onPress={onApply}>
                    <ThemedText style={styles.applyText}>Terapkan Filter</ThemedText>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },

    /* Vertical Option List */
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 15,
    },

    /* Radio circle */
    radioCircle: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 10,
    },

    applyButton: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    applyText: {
        color: "#fff",
        fontWeight: "600",
    },
});
