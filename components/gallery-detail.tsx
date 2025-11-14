import { Bookmark, Heart, MessageSquare, MoreHorizontal } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { addGalleryComment, toggleLikeGallery } from "@/lib/api/gallery";
import { Gallery, GalleryComment, GalleryMedia } from "@/lib/types/model";
import { CommentModal } from "./comment-modal";

const { width: SCREEN_W } = Dimensions.get("window");

interface Props {
    gallery: Gallery;
}

function Avatar({ uri, size = 36 }: { uri?: string | null; size?: number }) {
    const bg = useThemeColor({}, "border");

    return (
        <Image
            source={uri ? { uri } : require("@/assets/icons/default-profile.svg")}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: bg,
            }}
        />
    );
}

export function GalleryDetail({ gallery }: Props) {
    const text = useThemeColor({}, "text");
    const subText = useThemeColor({}, "subText");
    const bg = useThemeColor({}, "background");
    const card = useThemeColor({}, "card");
    const icon = useThemeColor({}, "icon");

    const { user } = useAuth();
    const currentUserId = user?.id;

    const dotInactive = icon;
    const dotActive = text;

    // slider state
    const [index, setIndex] = useState(0);
    const mediaRef = useRef<FlatList<GalleryMedia>>(null);

    const initialLiked = gallery.likes?.some(l => l.userId === currentUserId) ?? false;
    const initialLikesCount = gallery.likes?.length ?? gallery._count?.likes ?? 0;

    const [liked, setLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const likingRef = useRef(false);

    useEffect(() => {
        setLiked(gallery.likes?.some(l => l.userId === currentUserId) ?? false);
        setLikesCount(gallery.likes?.length ?? gallery._count?.likes ?? 0);
    }, [gallery, currentUserId]);


    // heart animation
    const heartScale = useRef(new Animated.Value(0)).current;
    const lastTap = useRef<number | null>(null);

    // comments
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [comments, setComments] = useState<GalleryComment[]>(gallery.comments ?? []);
    const [newComment, setNewComment] = useState("");

    const modalTranslate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        modalTranslate.setValue(300);
    }, [modalTranslate]);

    const openComments = () => {
        setCommentModalVisible(true);
        Animated.timing(modalTranslate, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const handleToggleLike = useCallback(async () => {
        if (likingRef.current) return;
        likingRef.current = true;

        try {
            setLiked((prev) => {
                const newValue = !prev;
                setLikesCount((count) => (newValue ? count + 1 : count - 1));
                return newValue;
            });

            await toggleLikeGallery(gallery.id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // rollback
            setLiked((prev) => {
                const reverted = !prev;
                setLikesCount((count) => (reverted ? count + 1 : count - 1));
                return reverted;
            });
        } finally {
            likingRef.current = false;
        }
    }, [gallery.id]);

    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < 300) {
            heartScale.setValue(0.6);
            Animated.spring(heartScale, {
                toValue: 1.2,
                friction: 4,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(heartScale, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            });

            if (!liked) handleToggleLike();
            lastTap.current = null;
        } else {
            lastTap.current = now;
        }
    };

    const submitComment = async () => {
        if (!newComment.trim()) return;

        try {
            const created = await addGalleryComment(gallery.id, { content: newComment });
            setComments((prev) => [created, ...prev]);
            setNewComment("");
        } catch { }
    };

    const renderMedia = ({ item }: { item: GalleryMedia }) => (
        <Pressable onPress={handleDoubleTap} style={[styles.mediaWrap, { backgroundColor: bg }]}>
            <Image source={{ uri: item.mediaUrl }} style={styles.media} resizeMode="cover" />
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.bigHeart,
                    {
                        transform: [
                            {
                                scale: heartScale.interpolate({
                                    inputRange: [0, 0.6, 1.2],
                                    outputRange: [0, 0.8, 1],
                                }),
                            },
                        ],
                        opacity: heartScale.interpolate({
                            inputRange: [0, 0.3, 1.2],
                            outputRange: [0, 0.9, 0],
                        }),
                    },
                ]}
            >
                <Heart width={96} height={96} color="white" />
            </Animated.View>
        </Pressable>
    );

    return (
        <ThemedView style={[styles.card, { backgroundColor: card }]}>
            {/* header */}
            <View style={styles.headerRow}>
                <View style={styles.userRow}>
                    <Avatar uri={gallery.user?.profilePicture} size={40} />
                    <View style={{ marginLeft: 10 }}>
                        <ThemedText style={[styles.username, { color: text }]}>
                            {gallery.user?.fullName ?? "Pengguna"}
                        </ThemedText>
                        <ThemedText style={[styles.eventTitle, { color: subText }]}>
                            {gallery.event?.title ?? ""}
                        </ThemedText>
                    </View>
                </View>

                <TouchableOpacity>
                    <MoreHorizontal width={20} height={20} color={icon} />
                </TouchableOpacity>
            </View>

            {/* slider */}
            <View style={{ width: "100%", height: 430 }}>
                <FlatList
                    ref={mediaRef}
                    data={gallery.media ?? []}
                    keyExtractor={(m) => String(m.id)}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderMedia}
                    onScroll={(e) => {
                        const offsetX = e.nativeEvent.contentOffset.x;
                        const currentIndex = Math.round(offsetX / SCREEN_W);
                        if (currentIndex !== index) setIndex(currentIndex);
                    }}
                    scrollEventThrottle={16}
                />

                <View style={styles.dots}>
                    {(gallery.media ?? []).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { backgroundColor: dotInactive },
                                i === index && {
                                    backgroundColor: dotActive,
                                    width: 8,
                                    height: 8,
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* actions */}
            <View style={styles.actionRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={handleToggleLike} style={styles.iconBtn}>
                        <Heart
                            width={22}
                            height={22}
                            color={liked ? "#E9446A" : icon}
                            fill={liked ? "#E9446A" : "transparent"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openComments} style={styles.iconBtn}>
                        <MessageSquare width={22} height={22} color={icon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.iconBtn}>
                    <Bookmark width={22} height={22} color={icon} />
                </TouchableOpacity>
            </View>

            {/* metadata */}
            <View style={styles.meta}>
                <ThemedText style={[styles.likesText, { color: text }]}>
                    {likesCount} likes
                </ThemedText>

                {gallery.caption ? (
                    <ThemedText style={[styles.captionText, { color: text }]}>
                        <ThemedText style={[styles.usernameInline, { color: text }]}>
                            {gallery.user?.fullName ?? "Pengguna"}{" "}
                        </ThemedText>
                        {gallery.caption}
                    </ThemedText>
                ) : null}

                {(comments ?? [])
                    .slice(0, 2)
                    .map((c) => (
                        <View key={c.id} style={{ marginTop: 6 }}>
                            <ThemedText style={{ color: text }}>
                                <ThemedText style={[styles.usernameInline, { color: text }]}>
                                    {c.user.fullName}{" "}
                                </ThemedText>
                                <ThemedText style={{ color: subText }}>
                                    {c.content}
                                </ThemedText>
                            </ThemedText>
                        </View>
                    ))}
            </View>

            <CommentModal
                visible={commentModalVisible}
                onClose={() => setCommentModalVisible(false)}
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                submitComment={submitComment}
            />
        </ThemedView>
    );
}
    
/* Styles (hanya layout, tanpa warna) */
const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    username: {
        fontWeight: "700",
    },
    eventTitle: {
        fontSize: 12,
    },
    mediaWrap: {
        width: SCREEN_W,
        height: 430,
        justifyContent: "center",
        alignItems: "center",
    },
    media: {
        width: "100%",
        height: "100%",
    },
    bigHeart: {
        position: "absolute",
        alignSelf: "center",
    },
    dots: {
        position: "absolute",
        bottom: 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.8,
        marginHorizontal: 3,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    iconBtn: {
        marginRight: 12,
    },
    meta: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    likesText: {
        fontWeight: "700",
        marginBottom: 6,
    },
    captionText: {
        marginTop: 6,
    },
    usernameInline: {
        fontWeight: "700",
    },
});
