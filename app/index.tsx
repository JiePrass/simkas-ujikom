import AnimatedSplash from "@/components/splash-screen";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function Index() {
    const [done, setDone] = useState(false);
    const { user } = useAuth();

    if (!done) {
        return <AnimatedSplash onFinish={() => setDone(true)} />;
    }

    // Setelah splash selesai → arahkan
    if (!user) return <Redirect href="/login" />;

    return <Redirect href="/(tabs)" />;
}
