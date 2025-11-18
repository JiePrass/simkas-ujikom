import { EventCard } from "@/components/event-card";
import { SearchBar } from "@/components/search-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllEvents } from "@/lib/api/event";
import { useRouter } from "expo-router";
import { BellIcon, ChevronRight } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const cardColor = useThemeColor({}, "card");
    const iconColor = useThemeColor({}, "icon");
    const primaryColor = useThemeColor({}, "primary");
    const { height } = Dimensions.get("window");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                const now = new Date();

                // Filter hanya event yang belum lewat
                const upcoming = data.filter((e: any) => new Date(e.date) >= now);

                // Urutkan berdasarkan tanggal terdekat
                upcoming.sort(
                    (a: any, b: any) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setEvents(upcoming);
            } catch (err) {
                console.error("Gagal memuat event:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 10) return "Selamat pagi";
        if (hour < 12) return "Selamat siang";
        if (hour < 18) return "Selamat sore";
        return "Selamat malam";
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ThemedView style={[styles.mainContainer, { minHeight: height }]}>
                    {/* HERO */}
                    <ThemedView style={styles.heroContainer}>
                        <View style={styles.heroTextContainer}>
                            <ThemedText type="defaultSemiBold" style={[styles.greeting, { color: textColor }]}>
                                {greeting},
                            </ThemedText>
                            <ThemedText type="title" style={[styles.heroTitle, { color: textColor }]}>
                                Selamat datang di SIMKAS!
                            </ThemedText>
                        </View>

                        <TouchableOpacity
                            style={[styles.notificationButton, { backgroundColor: cardColor }]}
                            activeOpacity={0.7}
                        >
                            <BellIcon size={22} color={iconColor} />
                        </TouchableOpacity>
                    </ThemedView>

                    {/* SEARCH */}
                    <View style={styles.searchContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/search")}
                        >
                            <SearchBar
                                placeholder="Cari Event"
                                value=""
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                    </View>


                    {/* BANNER */}
                    <ThemedView style={[styles.bannerContainer, { backgroundColor: primaryColor }]}>
                        <View style={styles.bannerTextBox}>
                            <ThemedText type="default" style={styles.bannerDesc}>
                                Mulai Daftar Berbagai Event
                            </ThemedText>
                            <ThemedText type="subtitle" style={styles.bannerTitle}>
                                Cari dan Ikuti Berbagai Event Menarik
                            </ThemedText>
                            <TouchableOpacity
                                style={[styles.bannerButton, { backgroundColor: backgroundColor }]}
                                onPress={() => router.push("/events")}
                            >
                                <ThemedText type="defaultSemiBold">Lanjutkan</ThemedText>
                                <ChevronRight size={20} color={textColor} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={require("@/assets/images/banner-home.png")}
                            style={styles.bannerImage}
                            resizeMode="contain"
                        />
                    </ThemedView>

                    {/* SECTION HEADER */}
                    <View style={styles.sectionHeader}>
                        <ThemedText type="title">Segera Dimulai!</ThemedText>
                        <TouchableOpacity onPress={() => router.push("/events")}>
                            <ThemedText style={styles.linkText}>
                                Lihat Semua
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.gridContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color={primaryColor} />
                        ) : events.length > 0 ? (
                            events.slice(0, 6).map((event) => (
                                <View style={styles.gridItem} key={event.id}>
                                    <EventCard event={event} onPress={() => router.push(`/event/${event.id}`)} />
                                </View>
                            ))
                        ) : (
                            <ThemedText style={{ textAlign: "center", marginTop: 12 }}>
                                Tidak ada event yang akan datang.
                            </ThemedText>
                        )}
                    </View>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },
    heroContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    heroTextContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 20,
        lineHeight: 24,
    },
    notificationButton: {
        aspectRatio: 1,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        elevation: 3,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    bannerContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    bannerTextBox: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 20,
    },
    bannerDesc: {
        fontSize: 16,
    },
    bannerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 12,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: "flex-start"
    },
    bannerImage: {
        width: 100,
        height: 100,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 24,
        paddingHorizontal: 20,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    gridItem: {
        width: "48%",
    },
    linkText: {
        fontSize: 14,
    },
});