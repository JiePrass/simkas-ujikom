import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/lib/api/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";

export default function ProfilePage() {
    const { logout } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCurrentUser();
                setUser(data);
            } catch (error: any) {
                console.log("Gagal memuat data user:", error?.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator size="large" />
                <ThemedText style={{ marginTop: 12 }}>Memuat data...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Profil Saya</ThemedText>

            {user ? (
                <View style={styles.infoBox}>
                    <ThemedText>Nama Lengkap: {user.fullName}</ThemedText>
                    <ThemedText>Email: {user.email}</ThemedText>
                    <ThemedText>No. Telepon: {user.phone || "-"}</ThemedText>
                    <ThemedText>Alamat: {user.address || "-"}</ThemedText>
                    <ThemedText>Pendidikan: {user.education || "-"}</ThemedText>
                </View>
            ) : (
                <ThemedText>Tidak ada data user.</ThemedText>
            )}

            <Button title="Logout" color="#E74C3C" onPress={handleLogout} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    infoBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
        gap: 4,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
