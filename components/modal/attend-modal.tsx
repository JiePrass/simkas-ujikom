import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { attendEvent } from "@/lib/api/event";
import React, { useState } from "react";
import { Modal, Platform, TextInput, TouchableOpacity, View } from "react-native";

interface AttendModalProps {
    visible: boolean;
    onClose: () => void;
    eventId: number;
    onSuccess?: () => void;
}

export default function AttendModal({ visible, onClose, eventId, onSuccess }: AttendModalProps) {
    const cardColor = useThemeColor({}, "card");
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAttend = async () => {
        if (!otp) return;
        setLoading(true);
        try {
            await attendEvent(eventId, otp);
            setLoading(false);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Attend error", err);
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" }}>
                <ThemedView style={{ width: "90%", padding: 18, borderRadius: 14, backgroundColor: cardColor }}>
                    <ThemedText type="title">Masukkan Kode OTP</ThemedText>

                    <TextInput
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Kode OTP"
                        placeholderTextColor="#999"
                        style={{ marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: Platform.OS === "web" ? "#fff" : undefined }}
                    />

                    <TouchableOpacity
                        onPress={handleAttend}
                        disabled={loading}
                        style={{ marginTop: 14, paddingVertical: 12, borderRadius: 10, backgroundColor: primary, alignItems: "center" }}
                    >
                        <ThemedText style={{ color: "white", fontWeight: "600" }}>{loading ? "Memproses..." : "Verifikasi"}</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={{ marginTop: 10, alignItems: "center" }}>
                        <ThemedText style={{ color: textColor }}>Batal</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </View>
        </Modal>
    );
}
