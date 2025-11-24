import { CertificateCard } from "@/components/certificate-card";
import { EventCard as EventCardComponent } from "@/components/event-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getUserProfile } from "@/lib/api/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const WINDOW = Dimensions.get("window");
const BANNER_HEIGHT = Math.round(WINDOW.height * 0.22);
const PROFILE_SIZE = 120;
const PROFILE_OVERLAP = PROFILE_SIZE * 0.55;

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"certificates" | "events">("certificates");

    const primary = useThemeColor({}, "primary");
    const background = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const cardColor = useThemeColor({}, "card");

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser?.id) return;

            try {
                const data = await getUserProfile(authUser.id);
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [authUser]);

    const handleLogout = () => router.replace("/login");

    if (loading) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: background   }]}>
                <ThemedView style={styles.center}>
                    <ActivityIndicator size="large" />
                    <ThemedText style={{ marginTop: 12 }}>Memuat data...</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: background }]}>
                <ThemedView style={styles.center}>
                    <ThemedText>User profile not found.</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    const certificates = profile.certificates ?? [];
    const events = profile.events ?? [];

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* ======================== BANNER ======================== */}
                <View style={styles.bannerWrap}>
                    {profile.bannerUrl ? (
                        <Image
                            source={{ uri: profile.bannerUrl }}
                            style={styles.bannerImage}
                        />
                    ) : (
                        <View style={[styles.bannerFallback, { backgroundColor: primary }]} />
                    )}

                    <View style={styles.bannerOverlay} />

                    <TouchableOpacity
                        style={[styles.settingsBtn, { backgroundColor: cardColor }]}
                        onPress={() => router.push("/")}
                    >
                        <Ionicons name="create-sharp" size={20} color={textColor} />
                    </TouchableOpacity>

                    <View style={styles.profileRow}>
                        {/* Foto profil */}
                        <View style={[styles.leftProfile, { borderColor: background }]}>
                            {profile.profilePicture ? (
                                <Image
                                    source={{ uri: profile.profilePicture }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View style={styles.profilePlaceholder}>
                                    <Ionicons name="person" size={46} color="#fff" />
                                </View>
                            )}
                        </View>

                        {/* Info user */}
                        <View style={styles.rightProfile}>
                            <ThemedText type="title" style={styles.nameText}>
                                {profile.fullName}
                            </ThemedText>

                            <ThemedText style={styles.subText}>{profile.email}</ThemedText>

                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                                        {events.length}
                                    </ThemedText>
                                    <ThemedText style={styles.statLabel}>Event</ThemedText>
                                </View>

                                <View style={styles.statItem}>
                                    <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                                        {certificates.length}
                                    </ThemedText>
                                    <ThemedText style={styles.statLabel}>Sertifikat</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ======================== TABS ======================== */}
                <View style={styles.tabWrap}>
                    <Pressable
                        style={[
                            styles.tabButton,
                            { backgroundColor: cardColor },
                            activeTab === "certificates" && {
                                backgroundColor: primary,
                                borderColor: primary,
                            },
                        ]}
                        onPress={() => setActiveTab("certificates")}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                activeTab === "certificates" && { color: textColor },
                            ]}
                        >
                            Sertifikat
                        </ThemedText>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.tabButton,
                            { backgroundColor: cardColor },
                            activeTab === "events" && {
                                backgroundColor: primary,
                                borderColor: primary,
                            },
                        ]}
                        onPress={() => setActiveTab("events")}
                    >
                        <ThemedText
                            style={[
                                styles.tabText,
                                activeTab === "events" && { color: textColor },
                            ]}
                        >
                            Event
                        </ThemedText>
                    </Pressable>
                </View>

                {/* ======================== CONTENT ======================== */}
                <View style={styles.contentWrap}>
                    {activeTab === "certificates" ? (
                        certificates.length === 0 ? (
                            <ThemedText style={{ padding: 16 }}>
                                Belum ada sertifikat yang tersedia.
                            </ThemedText>
                        ) : (
                            <FlatList
                                data={certificates}
                                keyExtractor={(it) => String(it.id)}
                                renderItem={({ item }) => (
                                    <CertificateCard certificate={item} />
                                )}
                                scrollEnabled={false}
                                contentContainerStyle={{ gap: 12 }}
                            />
                        )
                    ) : events.length === 0 ? (
                        <ThemedText style={{ padding: 16 }}>
                            Belum ada event yang diikuti.
                        </ThemedText>
                    ) : (
                        <View style={styles.gridContainer}>
                            {events.map((item: any) => (
                                <View key={item.id} style={styles.gridItem}>
                                    <EventCardComponent
                                        event={item}
                                        onPress={() => router.push(`/event/${item.id}`)}
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* ======================== LOGOUT ======================== */}
                <View style={{ padding: 16 }}>
                    <TouchableOpacity style={[styles.logoutBtn, {backgroundColor: cardColor}]} onPress={handleLogout}>
                        <ThemedText style={styles.logoutText}>Logout</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/*  ============================================================
    ========================= STYLES ============================= 
    ============================================================ */
const styles = StyleSheet.create({
    safe: { flex: 1 },
    scrollContent: { paddingBottom: 32 },

    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    bannerWrap: {
        height: BANNER_HEIGHT + PROFILE_OVERLAP,
    },
    bannerImage: { width: "100%", height: BANNER_HEIGHT },
    bannerFallback: { width: "100%", height: BANNER_HEIGHT },
    bannerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: BANNER_HEIGHT,
        backgroundColor: "rgba(0,0,0,0.15)",
    },

    settingsBtn: {
        position: "absolute",
        right: 14,
        top: 12,
        padding: 8,
        borderRadius: 20,
    },

    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    gridItem: {
        width: "48%",
    },

    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: -PROFILE_OVERLAP,
    },

    leftProfile: {
        width: PROFILE_SIZE,
        height: PROFILE_SIZE,
        borderRadius: PROFILE_SIZE / 2,
        overflow: "hidden",
        borderWidth: 3,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    profileImage: {
        width: PROFILE_SIZE,
        height: PROFILE_SIZE,
        borderRadius: PROFILE_SIZE / 2,
    },

    profilePlaceholder: {
        width: PROFILE_SIZE,
        height: PROFILE_SIZE,
        borderRadius: PROFILE_SIZE / 2,
        backgroundColor: "#8f9aa8",
        justifyContent: "center",
        alignItems: "center",
    },

    rightProfile: { flex: 1 },

    nameText: { marginBottom: 6 },

    subText: { opacity: 0.8 },

    statsRow: { flexDirection: "row", marginTop: 10 },
    statItem: { marginRight: 22 },
    statNumber: { fontSize: 18, fontWeight: "700" },
    statLabel: { fontSize: 12, opacity: 0.7 },

    tabWrap: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 10,
    },

    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    tabText: {
        fontWeight: "600",
    },

    contentWrap: { paddingHorizontal: 16, marginTop: 12 },

    logoutBtn: {
        paddingVertical: 12,
        borderColor: "#e74c3c",
        borderWidth: 1,
        color: "#e74c3c",
        borderRadius: 10,
        alignItems: "center",
    },

    logoutText: { color: "#e74c3c", fontWeight: "700" },
});
