import { GalleryCard } from "@/components/gallery-card";
import { SearchBar } from "@/components/search-bar";
import { ThemedView } from "@/components/themed-view";
import { getAllGalleries } from "@/lib/api/gallery";
import { Gallery, PaginatedGalleries } from "@/lib/types/model";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function GalleryCardSkeleton() {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View style={styles.box}>
            <View style={styles.skeleton}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        { transform: [{ translateX }] },
                    ]}
                >
                    <LinearGradient
                        colors={["#e0e0e0", "#f5f5f5", "#e0e0e0"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

function GallerySkeletonGrid() {
    return (
        <FlatList
            data={Array.from({ length: 18 })}
            numColumns={3}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={() => <GalleryCardSkeleton />}
            scrollEnabled={false}
        />
    );
}

export default function GalleryPage() {
    const router = useRouter();

    const [items, setItems] = useState<Gallery[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res: PaginatedGalleries = await getAllGalleries(page, 30);

        setItems(prev => [...prev, ...res.items]);

        if (res.items.length < 30) setHasMore(false);

        setPage(prev => prev + 1);
        setLoading(false);
    }, [page, loading, hasMore]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filtered = query
        ? items.filter(i =>
            i.caption?.toLowerCase().includes(query.toLowerCase())
        )
        : items;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={{ flex: 1, padding: 10, gap: 12 }}>
                <SearchBar
                    placeholder="Cari galeri..."
                    value={query}
                    onChangeText={setQuery}
                />

                {loading && page > 0 ? (
                    <GallerySkeletonGrid />
                ) : (
                    <FlatList
                        data={filtered}
                        numColumns={3}
                        onEndReached={loadData}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <GalleryCard
                                gallery={item}
                                onPress={() =>
                                    router.push({
                                        pathname: "/feed",
                                        params: { id: String(item.id) },
                                    })
                                }
                            />
                        )}
                    />
                )}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    box: {
        width: "33.33%",
        aspectRatio: 1,
        padding: 1,
    },
    skeleton: {
        flex: 1,
        borderRadius: 6,
        backgroundColor: "#d1d1d1",
        overflow: "hidden",
        opacity: 0.5,
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
});

