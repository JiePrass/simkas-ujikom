import AttendModal from "@/components/modal/attend-modal";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getEventById } from "@/lib/api/event";
import { checkUserRegistration, registerForEvent } from "@/lib/api/registration";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect } from "@react-navigation/native";

import * as WebBrowser from "expo-web-browser";

import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEventStarted, setIsEventStarted] = useState(false);

    const [registrationStatus, setRegistrationStatus] =
        useState<"NONE" | "PENDING" | "APPROVED">("NONE");

    const textColor = useThemeColor({}, "text");
    const primaryColor = useThemeColor({}, "primary");
    const backgroundColor = useThemeColor({}, "background");
    const cardColor = useThemeColor({}, "card");

    const [showAttendModal, setShowAttendModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getEventById(Number(id));
                setEvent(data);

                const res = await checkUserRegistration(Number(id));
                const reg = res.isRegistered;

                if (reg?.status === "APPROVED") {
                    setRegistrationStatus("APPROVED");
                } else if (reg?.status === "PENDING") {
                    setRegistrationStatus("PENDING");
                } else {
                    setRegistrationStatus("NONE");
                }
            } catch (err) {
                console.log("EventDetail init:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (!event) return;

        const eventDateTime = new Date(`${event.date}T${event.time}:00`);
        const now = new Date();
        setIsEventStarted(now >= eventDateTime);
    }, [event]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            (async () => {
                const res = await checkUserRegistration(Number(id));
                const reg = res.isRegistered;

                if (!isActive) return;

                if (reg?.status === "APPROVED") setRegistrationStatus("APPROVED");
                else if (reg?.status === "PENDING") setRegistrationStatus("PENDING");
                else setRegistrationStatus("NONE");
            })();

            return () => {
                isActive = false;
            };
        }, [id])
    );

    const handleRegister = async () => {
        try {
            const res = await registerForEvent(event.id);

            if (event.price === 0) {
                alert("Pendaftaran berhasil!");
                setRegistrationStatus("APPROVED");
                return;
            }

            await WebBrowser.openBrowserAsync(res.redirectUrl);

            alert("Silakan selesaikan pembayaran di halaman yang terbuka.");
            setRegistrationStatus("PENDING");
        } catch (err) {
            console.log("Register error:", err);
            alert("Gagal mendaftar. Silakan coba lagi.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!event) {
        return (
            <SafeAreaView style={styles.center}>
                <ThemedText>Event tidak ditemukan.</ThemedText>
            </SafeAreaView>
        );
    }

    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: cardColor + "CC" }]}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>

            <ScrollView style={{ flex: 1 }}>
                <Image source={{ uri: event.eventBannerUrl }} style={styles.banner} />

                <View style={styles.flyerWrapper}>
                    <Image source={{ uri: event.flyerUrl }} style={styles.flyer} />
                </View>

                <View style={styles.container}>
                    <ThemedText type="title" style={styles.title}>
                        {event.title}
                    </ThemedText>

                    <ThemedText style={styles.subtitle}>
                        Diselenggarakan oleh {event.createdBy.fullName ?? "Panitia"}
                    </ThemedText>

                    <View style={styles.infoBox}>
                        <ThemedText>{formattedDate}</ThemedText>
                        <ThemedText>{event.time}</ThemedText>
                        <ThemedText>{event.location}</ThemedText>
                        <ThemedText>
                            {event.price === 0
                                ? "Gratis"
                                : `Rp ${event.price.toLocaleString("id-ID")}`}
                        </ThemedText>
                    </View>

                    {registrationStatus === "NONE" && (
                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: primaryColor }]}
                            onPress={handleRegister}
                        >
                            <ThemedText style={styles.btnText}>Daftar Sekarang</ThemedText>
                        </TouchableOpacity>
                    )}

                    {registrationStatus === "PENDING" && (
                        <View style={styles.pendingBox}>
                            <ThemedText style={{ textAlign: "center" }}>
                                Menunggu konfirmasi pembayaran...
                            </ThemedText>
                        </View>
                    )}

                    {registrationStatus === "APPROVED" && (
                        <TouchableOpacity
                            disabled={!isEventStarted}
                            style={[
                                styles.primaryBtn,
                                {
                                    backgroundColor: isEventStarted
                                        ? primaryColor
                                        : "#CCC",
                                },
                            ]}
                            onPress={() => isEventStarted && setShowAttendModal(true)}
                        >
                            <ThemedText style={styles.btnText}>
                                {isEventStarted ? "Presensi" : "Event Belum Dimulai"}
                            </ThemedText>
                        </TouchableOpacity>
                    )}

                    <View style={{ marginTop: 20 }}>
                        <HTMLView
                            value={event.description}
                            stylesheet={{
                                h1: {
                                    fontSize: 26,
                                    fontWeight: "700",
                                    marginBottom: 12,
                                    color: textColor,
                                },
                                h2: {
                                    fontSize: 22,
                                    fontWeight: "600",
                                    marginBottom: 10,
                                    color: textColor,
                                },
                                h3: {
                                    fontSize: 18,
                                    fontWeight: "600",
                                    marginBottom: 8,
                                    color: textColor,
                                },
                                p: {
                                    fontSize: 15,
                                    lineHeight: 22,
                                    marginBottom: 10,
                                    color: textColor,
                                },
                                ul: { marginBottom: 10, paddingLeft: 20 },
                                ol: { marginBottom: 10, paddingLeft: 20 },
                                li: {
                                    fontSize: 15,
                                    lineHeight: 22,
                                    marginBottom: 6,
                                    color: textColor,
                                },
                                span: { color: textColor },
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            <AttendModal
                visible={showAttendModal}
                onClose={() => setShowAttendModal(false)}
                eventId={Number(id)}
                onSuccess={() => alert("Presensi berhasil")}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    banner: { width: "100%", height: 220 },

    flyerWrapper: { marginTop: -60, alignItems: "center" },

    flyer: {
        width: 160,
        height: 220,
        borderRadius: 12,
        backgroundColor: "#fff",
        elevation: 5,
    },

    container: { padding: 20 },
    title: { fontSize: 22, marginTop: 16 },
    subtitle: { color: "#555", marginBottom: 20 },

    infoBox: { gap: 4, marginBottom: 20 },

    primaryBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    btnText: { fontWeight: "600" },

    pendingBox: {
        backgroundColor: "#EFEFEF",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    backButton: {
        position: "absolute",
        top: 44,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
});
