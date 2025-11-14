import { useThemeColor } from "@/hooks/use-theme-color";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    placeholder?: string;
    value: string;
    onChangeText?: (text: string) => void;
    onFilterPress?: () => void;

    editable?: boolean;
    autoFocus?: boolean;
    pointerEvents?: "auto" | "none" | "box-none" | "box-only";
}

export function SearchBar({
    placeholder,
    value,
    onChangeText,
    onFilterPress,
    editable = true,
    autoFocus = false,
    pointerEvents = "auto",
}: Props) {
    const backgroundColor = useThemeColor({}, "card");
    const textColor = useThemeColor({}, "text");
    const borderColor = useThemeColor({}, "border");
    const iconColor = useThemeColor({}, "icon");
    const primaryColor = useThemeColor({}, "primary");

    return (
        <View style={styles.wrapper}>
            <View style={[styles.container, { backgroundColor, borderColor }]}>
                <Search size={18} color={iconColor} style={{ marginRight: 8 }} />

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={iconColor + "99"}
                    style={[styles.input, { color: textColor }]}
                    editable={editable}
                    autoFocus={autoFocus}
                    pointerEvents={pointerEvents}
                />
            </View>

            {onFilterPress && (
                <TouchableOpacity
                    onPress={onFilterPress}
                    style={[styles.filterButton, { backgroundColor: primaryColor }]}
                    activeOpacity={0.7}
                >
                    <SlidersHorizontal size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: 14,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});
