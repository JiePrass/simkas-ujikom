import { EventCard } from "@/components/event-card";
import { SearchBar } from "@/components/search-bar";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllEvents } from "@/lib/api/event";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const bg = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            {/* Header Search */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={26} color={textColor} />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <SearchBar
                        placeholder="Cari Event"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus={true}
                    />
                </View>
            </View>

            {/* Search results */}
            <ScrollView contentContainerStyle={styles.gridContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={primary} style={{ marginTop: 20 }} />
                ) : filteredEvents.length === 0 ? (
                    <ThemedText style={{ marginTop: 20, textAlign: "center" }}>
                        Tidak ada event yang cocok.
                    </ThemedText>
                ) : (
                    filteredEvents.map((event) => (
                        <View key={event.id} style={styles.gridItem}>
                            <EventCard event={event} />
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    backButton: {
        padding: 6,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    gridItem: {
        width: "48%",
    },
});
