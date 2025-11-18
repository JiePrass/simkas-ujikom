import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getCurrentUser, loginUser, loginWithGoogle } from "@/lib/api/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";


export default function LoginPage() {
    const textColor = useThemeColor({}, "text");
    const primaryColor = useThemeColor({}, "primary");
    const borderColor = useThemeColor({}, "border");
    const inputBackgroundColor = useThemeColor({}, "inputBackground");
    const iconColor = useThemeColor({}, "icon");
    const placeholderColor = useThemeColor({}, "placeholder");
    const subTextColor = useThemeColor({}, "subText");

    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);


    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Isi semua field.");
        }

        try {
            setLoading(true);

            // 1. Login → dapat token
            const res = await loginUser({ email, password });

            // 2. Simpan token dulu (tanpa user)
            await login(res.token);

            // 3. Fetch data user dari /me
            const me = await getCurrentUser();

            // 5. Cek apakah profil sudah lengkap
            const isIncomplete =
                !me.phone || !me.address || !me.education || me.phone === "";

            if (isIncomplete) {
                router.replace("/complete-profile");
            } else {
                router.replace("/(tabs)");
            }

        } catch (error: any) {
            Alert.alert(
                "Login gagal",
                error?.response?.data?.error || "Terjadi kesalahan"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const res = await loginWithGoogle("GOOGLE_AUTH_CODE");
            await login(res.token, res.user);
            router.replace("/(tabs)");
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
                <ThemedText type="title" style={styles.centerText}>
                    Selamat Datang Kembali di SIMKAS
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                    Masuk untuk mengikuti event dan melanjutkan aktivitasmu
                </ThemedText>
            </View> 

            {/* EMAIL */}
            <View
                style={[
                    styles.inputWrapper,
                    { backgroundColor: inputBackgroundColor, borderColor: borderColor },
                ]}
            >
                <ThemedTextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />
            </View>

            {/* PASSWORD */}
            <View
                style={[
                    styles.inputWrapper,
                    { backgroundColor: inputBackgroundColor, borderColor: borderColor },
                ]}
            >
                <ThemedTextInput
                    placeholder="Kata Sandi"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={placeholderColor}
                    style={[styles.inputField, { color: textColor }]}
                />

                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                >
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color={iconColor}
                    />
                </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: primaryColor },
                    loading && { opacity: 0.6 },
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <ThemedText style={[styles.buttonText, { color: textColor }]}>
                    {loading ? "Memproses..." : "Login"}
                </ThemedText>
            </TouchableOpacity>

            {/* OR */}
            <View style={styles.orWrapper}>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
                <ThemedText style={[styles.orText, { color: subTextColor }]}>
                    atau
                </ThemedText>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
            </View>

            {/* GOOGLE LOGIN */}
            <TouchableOpacity
                style={[
                    styles.googleButton,
                    {
                        borderColor: borderColor,
                        backgroundColor: inputBackgroundColor,
                    },
                    googleLoading && { opacity: 0.7 },
                ]}
                onPress={handleGoogleLogin}
                disabled={googleLoading}
            >
                <Image
                    source={require("@/assets/icons/google.png")}
                    style={styles.googleIcon}
                />
                <ThemedText style={[styles.googleText, { color: textColor }]}>
                    {googleLoading ? "Menghubungkan..." : "Login dengan Google"}
                </ThemedText>
            </TouchableOpacity>

            <Link href="/register" style={styles.link}>
                <ThemedText>Belum Punya Akun?</ThemedText> Daftar
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
        textAlign: "center",
    },

    orWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 6,
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
        textAlign: "center",
    },

    link: {
        textAlign: "center",
        marginTop: 14,
        color: "#3498DB",
    },
});
