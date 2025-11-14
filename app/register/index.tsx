import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextInput } from "@/components/themed-text-input";
import { registerUser } from "@/lib/api/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        education: "",
        address: "",
        password: "",
    });

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (step === 1 && (!form.fullName || !form.email || !form.phone)) {
            return Alert.alert("Error", "Lengkapi semua data terlebih dahulu.");
        }
        if (step === 2 && (!form.education || !form.address)) {
            return Alert.alert("Error", "Lengkapi semua data terlebih dahulu.");
        }
        setStep(step + 1);
    };

    const handleRegister = async () => {
        if (!form.password)
            return Alert.alert("Error", "Kata sandi wajib diisi.");
        try {
            setLoading(true);
            const res = await registerUser(form);
            Alert.alert("Berhasil", res.message || "Akun berhasil dibuat.");
            router.push({
                pathname: "/verify-email",
                params: { email: form.email },
            });
        } catch (err: any) {
            Alert.alert("Gagal", err.response?.data?.error || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">
                {step === 1 && "Data Diri"}
                {step === 2 && "Informasi Tambahan"}
                {step === 3 && "Keamanan Akun"}
            </ThemedText>

            {/* STEP 1 */}
            {step === 1 && (
                <View style={styles.formGroup}>
                    <ThemedTextInput
                        placeholder="Nama Lengkap"
                        value={form.fullName}
                        onChangeText={(v) => handleChange("fullName", v)}
                    />
                    <ThemedTextInput
                        placeholder="Email"
                        value={form.email}
                        onChangeText={(v) => handleChange("email", v)}
                    />
                    <ThemedTextInput
                        placeholder="Nomor Telepon"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) => handleChange("phone", v)}
                    />
                </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <View style={styles.formGroup}>
                    <ThemedTextInput
                        placeholder="Pendidikan Terakhir"
                        value={form.education}
                        onChangeText={(v) => handleChange("education", v)}
                    />
                    <ThemedTextInput
                        placeholder="Alamat Lengkap"
                        value={form.address}
                        onChangeText={(v) => handleChange("address", v)}
                    />
                </View>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <View style={styles.formGroup}>
                    <ThemedTextInput
                        placeholder="Kata Sandi"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(v) => handleChange("password", v)}
                    />
                </View>
            )}

            {/* BUTTONS */}
            <View style={styles.buttonGroup}>
                {step > 1 && (
                    <TouchableOpacity
                        style={[styles.button, styles.backButton]}
                        onPress={() => setStep(step - 1)}
                    >
                        <ThemedText style={styles.backText}>Kembali</ThemedText>
                    </TouchableOpacity>
                )}

                {step < 3 ? (
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <ThemedText style={styles.buttonText}>Lanjut</ThemedText>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        disabled={loading}
                        onPress={handleRegister}
                    >
                        <ThemedText style={styles.buttonText}>
                            {loading ? "Mendaftar..." : "Daftar"}
                        </ThemedText>
                    </TouchableOpacity>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },
    formGroup: {
        gap: 12,
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    button: {
        backgroundColor: "#27AE60",
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 8,
    },
    backButton: {
        backgroundColor: "#ddd",
        marginLeft: 0,
        marginRight: 8,
    },
    buttonText: { color: "#fff", fontWeight: "600" },
    backText: { color: "#333", fontWeight: "600" },
});
