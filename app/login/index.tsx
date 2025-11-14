import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/lib/api/auth";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password)
            return Alert.alert("Error", "Isi semua field.");

        try {
            setLoading(true);

            // ✅ gunakan loginUser, bukan loginApi
            const res = await loginUser({ email, password });

            // ✅ simpan token + user di AuthContext
            await login(res.token, res.user);

            router.replace("/(tabs)");
        } catch (error: any) {
            Alert.alert(
                "Login gagal",
                error?.response?.data?.error || "Terjadi kesalahan"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Masuk ke Akun</ThemedText>

            <ThemedTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <ThemedTextInput
                placeholder="Kata Sandi"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
            >
                <ThemedText style={styles.buttonText}>
                    {loading ? "Memproses..." : "Login"}
                </ThemedText>
            </TouchableOpacity>

            <Link href="/register" style={styles.link}>
                <ThemedText>Belum Punya Akun?</ThemedText> Daftar
            </Link>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
    button: {
        backgroundColor: "#2F80ED",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600" },
    link: { color: "#2F80ED", textAlign: "center", marginTop: 12 },
});
