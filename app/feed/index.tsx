import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GalleryDetail } from "@/components/gallery-detail";
import { getAllGalleries, getGalleryDetail } from "@/lib/api/gallery";
import { Gallery } from "@/lib/types/model";
import { ArrowLeft } from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function GalleryFeedPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [mainGallery, setMainGallery] = useState<Gallery | null>(null);
    const [feed, setFeed] = useState<Gallery[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const border = useThemeColor({}, "border");
    const text = useThemeColor({}, "text");
    const card = useThemeColor({}, "card");
    const icon = useThemeColor({}, "icon");

    useEffect(() => {
        loadMain();
        loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMain = async () => {
        const res = await getGalleryDetail(Number(id));
        setMainGallery(res);
    };

    const loadFeed = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res = await getAllGalleries(page, 10);
        const items = res.items;

        // Hilangkan item yang sama dengan main gallery
        const cleaned = items.filter((g) => g.id !== Number(id));

        setFeed((prev) => [...prev, ...cleaned]);
        if (items.length < 10) setHasMore(false);

        setPage((prev) => prev + 1);
        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, loading, hasMore]);

    if (!mainGallery) {
        return (
            <ThemedView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </ThemedView>
        );
    }

    const combined = [mainGallery, ...feed];

    console.log("Combined galleries:", combined);
    console.log("main gallery:", mainGallery);
    console.log("other gallery:", feed);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: card }}>
            <FlatList
                data={combined}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <GalleryDetail gallery={item} />}

                onEndReached={loadFeed}
                onEndReachedThreshold={0.4}

                stickyHeaderIndices={[0]}
                ListHeaderComponent={
                    <ThemedView
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: border,
                            backgroundColor: card,
                        }}
                    >
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={icon} />
                        </TouchableOpacity>

                        <ThemedText
                            style={{
                                fontSize: 18,
                                marginLeft: 10,
                                fontWeight: "600",
                                color: text,
                            }}
                        >
                            Detail Galeri
                        </ThemedText>
                    </ThemedView>
                }

                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} />
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
