import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { loginWithGoogle, registerUser } from "@/lib/api/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterPage() {
    const textColor = useThemeColor({}, "text");
    const primaryColor = useThemeColor({}, "primary");
    const borderColor = useThemeColor({}, "border");
    const inputBackgroundColor = useThemeColor({}, "inputBackground");
    const iconColor = useThemeColor({}, "icon");
    const placeholderColor = useThemeColor({}, "placeholder");
    const subTextColor = useThemeColor({}, "subText");

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const updateForm = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleRegister = async () => {
        if (!form.fullName || !form.email || !form.password || !form.confirmPassword)
            return Alert.alert("Error", "Isi semua field.");

        if (form.password !== form.confirmPassword)
            return Alert.alert("Error", "Konfirmasi kata sandi tidak cocok.");

        try {
            setLoading(true);

            const res = await registerUser({
                fullName: form.fullName,
                email: form.email,
                phone: "",
                education: "",
                address: "",
                password: form.password,
            });

            Alert.alert("Berhasil", res.message || "Akun berhasil dibuat.");

            router.push({
                pathname: "/verify-email",
                params: { email: form.email },
            });

        } catch (error: any) {
            Alert.alert(
                "Gagal",
                error?.response?.data?.error || "Terjadi kesalahan."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);

            const res = await loginWithGoogle("GOOGLE_AUTH_CODE");

            // Jika backend mendaftarkan user baru → cek verifikasi email
            if (!res.user?.isVerified) {
                return router.push({
                    pathname: "/verify-email",
                    params: { email: res.user.email },
                });
            }

            // router.replace("/complete-profile");

        } catch (error: any) {
            Alert.alert(
                "Google Login gagal",
                error?.response?.data?.error || "Terjadi kesalahan"
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.headerBlock}>
                <ThemedText type="title" style={[styles.centerText, { color: textColor }]}>
                    Buat Akun Baru
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: subTextColor }]}>
                    Daftar untuk melanjutkan.
                </ThemedText>
            </View>

            {/* FULL NAME */}
            <View style={[styles.inputWrapper, { backgroundColor: inputBackgroundColor, borderColor }]}>
                <ThemedTextInput
                    placeholder="Nama Lengkap"
                    value={form.fullName}
                    onChangeText={(v) => updateForm("fullName", v)}
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />
            </View>

            {/* EMAIL */}
            <View style={[styles.inputWrapper, { backgroundColor: inputBackgroundColor, borderColor }]}>
                <ThemedTextInput
                    placeholder="Email"
                    value={form.email}
                    onChangeText={(v) => updateForm("email", v)}
                    autoCapitalize="none"
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />
            </View>

            {/* PASSWORD */}
            <View style={[styles.inputWrapper, { backgroundColor: inputBackgroundColor, borderColor }]}>
                <ThemedTextInput
                    placeholder="Kata Sandi"
                    value={form.password}
                    onChangeText={(v) => updateForm("password", v)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={[styles.inputWrapper, { backgroundColor: inputBackgroundColor, borderColor }]}>
                <ThemedTextInput
                    placeholder="Konfirmasi Kata Sandi"
                    value={form.confirmPassword}
                    onChangeText={(v) => updateForm("confirmPassword", v)}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* REGISTER BUTTON */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: primaryColor }, loading && { opacity: 0.6 }]}
                onPress={handleRegister}
                disabled={loading}
            >
                <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
                    {loading ? "Memproses..." : "Daftar"}
                </ThemedText>
            </TouchableOpacity>

            {/* OR */}
            <View style={styles.orWrapper}>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
                <ThemedText style={[styles.orText, { color: subTextColor }]}>atau</ThemedText>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
            </View>

            {/* GOOGLE LOGIN */}
            <TouchableOpacity
                style={[
                    styles.googleButton,
                    { borderColor: borderColor, backgroundColor: inputBackgroundColor },
                    googleLoading && { opacity: 0.7 },
                ]}
                onPress={handleGoogleLogin}
                disabled={googleLoading}
            >
                <Image source={require("@/assets/icons/google.png")} style={styles.googleIcon} />
                <ThemedText style={[styles.googleText, { color: textColor }]}>
                    {googleLoading ? "Menghubungkan..." : "Daftar dengan Google"}
                </ThemedText>
            </TouchableOpacity>

            <Link href="/login" style={styles.link}>
                <ThemedText>Sudah punya akun? </ThemedText> Masuk
            </Link>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
        gap: 24,
    },
    headerBlock: {
        alignItems: "center",
        marginBottom: 12,
    },
    centerText: {
        textAlign: "center",
    },
    subtitle: {
        textAlign: "center",
        marginTop: 4,
        fontSize: 14,
        opacity: 0.7,
    },
    inputWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 14,
        height: 52,
    },
    inputField: {
        flex: 1,
        height: "100%",
        fontSize: 16,
    },
    eyeButton: {
        paddingLeft: 8,
        paddingRight: 4,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        fontWeight: "600",
    },
    orWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: -10,
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        fontSize: 13,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 12,
        width: "100%",
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontWeight: "600",
    },
    link: {
        textAlign: "center",
        marginTop: 14,
        color: "#3498DB",
    },
});
