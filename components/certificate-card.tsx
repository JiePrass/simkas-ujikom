import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Download } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface Certificate {
    id: number;
    eventTitle: string;
    eventDate?: string;
    issuedAt?: string;
    url?: string;
}

interface Props {
    certificate: Certificate;
    onPress?: () => void;
    onDownload?: () => void;
    validateBeforeDownload?: () => Promise<boolean> | boolean;
}

export const CertificateCard = ({
    certificate,
    onPress,
    onDownload,
    validateBeforeDownload,
}: Props) => {
    const cardBg = useThemeColor({}, "card");
    const border = useThemeColor({}, "border");
    const textColor = useThemeColor({}, "text");
    const subText = useThemeColor({}, "subText");

    const parseDate = (date?: string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const dateString = parseDate(certificate.issuedAt ?? certificate.eventDate);

    const handleDownload = async () => {
        if (validateBeforeDownload) {
            const ok = await validateBeforeDownload();
            if (!ok) return; // stop download
        }

        onDownload?.();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleDownload} // tekan kartu → validasi → download
            style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
        >
            {/* Thumb */}
            <View style={styles.left}>
                {certificate.url ? (
                    <Image source={{ uri: certificate.url }} style={styles.thumb} />
                ) : (
                    <View style={[styles.thumbPlaceholder, { backgroundColor: border }]}>
                        <ThemedText style={{ fontSize: 10, color: subText }}>No Image</ThemedText>
                    </View>
                )}
            </View>

            {/* Body */}
            <View style={styles.body}>
                <ThemedText type="defaultSemiBold" style={[styles.title, { color: textColor }]}>
                    {certificate.eventTitle}
                </ThemedText>

                <ThemedText style={[styles.meta, { color: subText }]}>
                    {dateString}
                </ThemedText>
            </View>

            {/* Download Icon */}
            <TouchableOpacity onPress={handleDownload} style={styles.action}>
                <Download size={18} color={textColor} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
    },
    left: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: "hidden",
        marginRight: 12,
    },
    thumb: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    thumbPlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    body: { flex: 1 },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
    meta: { fontSize: 12 },
    action: { padding: 6 },
});
