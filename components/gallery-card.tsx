import { Gallery } from "@/lib/types/model";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
    gallery: Gallery;
    onPress?: () => void;
}

export function GalleryCard({ gallery, onPress }: Props) {
    const firstMedia = gallery.media?.[0]?.mediaUrl;

    return (
        <TouchableOpacity style={styles.box} onPress={onPress}>
            <Image
                source={{ uri: firstMedia }}
                style={styles.img}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        width: "33.33%",
        aspectRatio: 1,
        padding: 1,
    },
    img: {
        width: "100%",
        height: "100%",
        borderRadius: 6,
        backgroundColor: "#ccc",
    },
});
