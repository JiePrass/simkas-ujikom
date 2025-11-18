import { ThemedText } from "@/components/themed-text";

import AttendModal from "@/components/modal/attend-modal";
import UploadPaymentModal from "@/components/modal/upload-payment-modal";

import { getEventById } from "@/lib/api/event";
import { checkUserRegistration, registerForEvent } from "@/lib/api/registration";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import RenderHTML from "react-native-render-html";

export default function EventDetail() {
    const { id } = useLocalSearchParams();
    const { width } = useWindowDimensions();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [registrationStatus, setRegistrationStatus] =
        useState<"NONE" | "REGISTERED" | "PENDING" | "APPROVED">("NONE");

    const textColor = useThemeColor({}, "text");
    const primaryColor = useThemeColor({}, "primary");

    // Modal states
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAttendModal, setShowAttendModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getEventById(Number(id));
                setEvent(data);

                const reg = await checkUserRegistration(Number(id));
                if (reg?.status === "APPROVED") setRegistrationStatus("APPROVED");
                else if (reg?.status) setRegistrationStatus("REGISTERED");
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.center}>
                <ThemedText>Event tidak ditemukan.</ThemedText>
            </View>
        );
    }

    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const handleRegister = async () => {
        try {
            if (event.price === 0) {
                // FormData kosong
                const formData = new FormData();

                await registerForEvent(event.id, formData);

                alert("Pendaftaran berhasil!");
                setRegistrationStatus("APPROVED");

            } else {
                setShowUploadModal(true);
            }
        } catch (err) {
            console.log(err);
            alert("Gagal mendaftar. Silakan coba lagi.");
        }
    };

    return (
        <>
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

                    {/* ACTION BUTTON */}
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
                                Menunggu konfirmasi pembayaran
                            </ThemedText>
                        </View>
                    )}

                    {registrationStatus === "APPROVED" && (
                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: primaryColor }]}
                            onPress={() => setShowAttendModal(true)}
                        >
                            <ThemedText style={styles.btnText}>Presensi</ThemedText>
                        </TouchableOpacity>
                    )}

                    <View style={{ marginTop: 20 }}>
                        <RenderHTML
                            contentWidth={width}
                            baseStyle={{ color: textColor }}
                            source={{ html: event.description }}
                            tagsStyles={{
                                h1: { fontSize: 26, fontWeight: "700", marginBottom: 12 },
                                h2: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
                                p: { fontSize: 15, lineHeight: 22, marginBottom: 10 },
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* ==== UPLOAD PAYMENT MODAL ==== */}
            <UploadPaymentModal
                visible={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                eventId={Number(id)}
                onSuccess={() => setRegistrationStatus("REGISTERED")}
            />

            {/* ==== ATTEND MODAL ==== */}
            <AttendModal
                visible={showAttendModal}
                onClose={() => setShowAttendModal(false)}
                eventId={Number(id)}
                onSuccess={() => alert("Presensi berhasil")}
            />
        </>
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
});
