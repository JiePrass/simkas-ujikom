import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { verifyEmail } from "@/lib/api/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

export default function VerifyEmailPage() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            Alert.alert("Peringatan", "Masukkan kode OTP terlebih dahulu.");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyEmail({ email, otp });
            Alert.alert("Berhasil", res.message);
            router.push("/login");
        } catch (err: any) {
            Alert.alert("Gagal", err.response?.data?.error || "OTP tidak valid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Verifikasi Email</ThemedText>
            <ThemedText>Kode OTP telah dikirim ke {email}</ThemedText>

            <TextInput
                placeholder="Masukkan Kode OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                style={styles.input}
                editable={!loading}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <ThemedText style={styles.buttonText}>Verifikasi</ThemedText>
                )}
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
    },
    button: {
        backgroundColor: "#27AE60",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: { color: "#fff", fontWeight: "600" },
});
