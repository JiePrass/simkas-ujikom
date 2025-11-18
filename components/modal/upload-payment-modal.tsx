import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { registerForEvent } from "@/lib/api/registration";

import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Image,
    Modal,
    TouchableOpacity,
    View,
} from "react-native";

interface UploadPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    eventId: number;
    onSuccess?: () => void;
}

function normalizeFile(asset: any) {
    let uri = asset.uri;

    // Tentukan nama
    let name = asset.fileName || `payment.${uri.split(".").pop() || "jpg"}`;
    if (!name.includes(".")) {
        name += ".jpg";
    }

    // Tentukan type
    let type = asset.mimeType;
    if (!type) {
        const ext = name.split(".").pop()?.toLowerCase();
        switch (ext) {
            case "png":
                type = "image/png";
                break;
            case "jpg":
            case "jpeg":
            default:
                type = "image/jpeg";
        }
    }

    return { uri, name, type };
}

export default function UploadPaymentModal({
    visible,
    onClose,
    eventId,
    onSuccess,
}: UploadPaymentModalProps) {
    const cardColor = useThemeColor({}, "card");
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    const [proof, setProof] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // ============================
    // PICK IMAGE
    // ============================
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const normalized = normalizeFile(asset);
                setProof(normalized);
            }
        } catch (err) {
            console.warn("ImagePicker error:", err);
        }
    };

    // ============================
    // SUBMIT PAYMENT PROOF
    // ============================
    const handleSubmit = async () => {
        if (!proof) return;

        setLoading(true);

        try {
            await registerForEvent(eventId, {
                uri: proof.uri,
                name: proof.name,
                type: proof.type,
            } as any);

            setLoading(false);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Upload error:", err);
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.45)",
                }}
            >
                <ThemedView
                    style={{
                        width: "90%",
                        padding: 18,
                        borderRadius: 14,
                        backgroundColor: cardColor,
                    }}
                >
                    <ThemedText type="title">
                        Upload Bukti Pembayaran
                    </ThemedText>

                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            marginTop: 14,
                            padding: 12,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#ddd",
                        }}
                    >
                        <ThemedText>Pilih Gambar</ThemedText>
                    </TouchableOpacity>

                    {proof && (
                        <Image
                            source={{ uri: proof.uri }}
                            style={{
                                width: "100%",
                                height: 160,
                                marginTop: 12,
                                borderRadius: 8,
                            }}
                            resizeMode="cover"
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        style={{
                            marginTop: 16,
                            paddingVertical: 12,
                            borderRadius: 10,
                            backgroundColor: primary,
                            alignItems: "center",
                        }}
                    >
                        <ThemedText
                            style={{ color: "white", fontWeight: "600" }}
                        >
                            {loading ? "Mengirim..." : "Kirim Bukti"}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={{ marginTop: 10, alignItems: "center" }}
                    >
                        <ThemedText style={{ color: textColor }}>
                            Tutup
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </View>
        </Modal>
    );
}
