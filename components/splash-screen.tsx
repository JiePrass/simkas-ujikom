import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, useColorScheme } from "react-native";

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeOutAnim = useRef(new Animated.Value(1)).current;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start(() => { setTimeout(onFinish, 1000); });
    }, [fadeAnim, onFinish]);

    const logoSource = isDark
        ? require("@/assets/icons/jp-white.png")
        : require("@/assets/icons/jp-black.png");
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: useThemeColor({}, "background"),
                    opacity: fadeOutAnim,
                },
            ]}
        >
            <Animated.Image
                source={logoSource}
                style={[styles.logo, { opacity: fadeAnim }]}
                resizeMode="contain"
            />
            <Animated.Text
                style={[
                    styles.powered,
                    {
                        opacity: fadeAnim,
                        color: useThemeColor({}, "text"),
                    },
                ]}
            >
                Powered by JiePrass Studio
            </Animated.Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    powered: {
        fontSize: 14,
        fontWeight: "600",
    },
});
