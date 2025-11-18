import { ThemedText } from "@/components/themed-text";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays, MapPin } from "lucide-react-native";
import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

interface EventCardProps {
    event: {
        id: number;
        title: string;
        date: string;
        time: string;
        location: string;
        price: number;
        flyerUrl: string;
        description: string;
    };
    onPress?: () => void;  // ⬅ tambahan
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const formattedPrice =
        event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>

            <ImageBackground
                source={{ uri: event.flyerUrl }}
                style={styles.image}
                imageStyle={styles.imageStyle}
            >
                {/* Badge Harga */}
                <View style={styles.priceBadge}>
                    <ThemedText style={styles.priceBadgeText}>
                        {formattedPrice}
                    </ThemedText>
                </View>

                {/* INSET GRADIENT */}
                <LinearGradient
                    colors={[
                        "rgba(0,0,0,0.6)",  // sudut lebih gelap
                        "rgba(0,0,0,0.25)", // tengah lebih terang
                        "rgba(0,0,0,0.6)",  // sudut lebih gelap
                    ]}
                    style={styles.insetGradient}
                />

                {/* Text Content */}
                <View style={styles.textContent}>

                    {/* Lokasi */}
                    <View style={styles.row}>
                        <MapPin size={14} color="white" />
                        <ThemedText style={styles.infoText}>
                            {event.location}
                        </ThemedText>
                    </View>

                    {/* Judul */}
                    <ThemedText
                        type="defaultSemiBold"
                        style={styles.title}
                        numberOfLines={1}
                    >
                        {event.title}
                    </ThemedText>

                    {/* Tanggal */}
                    <View style={styles.row}>
                        <CalendarDays size={14} color="white" />
                        <ThemedText style={styles.infoText}>
                            {formattedDate}
                        </ThemedText>
                    </View>

                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 16,
    },

    image: {
        flex: 1,
        justifyContent: "flex-end",
    },

    imageStyle: {
        borderRadius: 18,
    },

    priceBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        zIndex: 5,
    },

    priceBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },

    insetGradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },

    textContent: {
        padding: 12,
        position: "relative",
        zIndex: 5,
    },

    title: {
        fontSize: 16,
        color: "white",
        marginVertical: 2,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },

    infoText: {
        color: "white",
        fontSize: 13,
        marginLeft: 4,
    },
});
