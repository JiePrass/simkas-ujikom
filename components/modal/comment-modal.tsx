import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryComment } from "@/lib/types/model";
import React, { useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    comments: GalleryComment[];
    newComment: string;
    setNewComment: (val: string) => void;
    submitComment: (parentId?: number | null) => Promise<void> | void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function CommentModal({
    visible,
    onClose,
    comments,
    newComment,
    setNewComment,
    submitComment,
}: CommentModalProps) {
    const { user } = useAuth();
    const inputRef = useRef<TextInput>(null);

    const translateY = useRef(new Animated.Value(0)).current;

    /** Pan responder untuk drag close */
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dy > 120) {
                onClose();
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    const [replyTo, setReplyTo] = useState<GalleryComment | null>(null);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const grouped = useMemo(() => {
        const map: Record<number, GalleryComment[]> = {};
        comments.forEach((c) => {
            const parent = c.parentId ?? 0;
            if (!map[parent]) map[parent] = [];
            map[parent].push(c);
        });
        return map;
    }, [comments]);

    /** Render replies dengan avatar */
    const renderReplies = (parentId: number, level: number) => {
        const replies = grouped[parentId] || [];
        if (!expanded[parentId]) return null;

        return replies.map((reply) => (
            <View key={reply.id} style={[styles.commentRow, { marginLeft: level * 26 }]}>
                <Image
                    source={{ uri: reply.user.profilePicture ?? undefined }}
                    style={styles.avatar}
                />

                <View style={{ flex: 1 }}>
                    <ThemedText style={styles.username}>{reply.user.fullName}</ThemedText>
                    <ThemedText style={styles.commentContent}>{reply.content}</ThemedText>

                    {level < 2 && (
                        <View style={styles.replyActions}>
                            <TouchableOpacity
                                onPress={() => {
                                    setReplyTo(reply);
                                    inputRef.current?.focus();
                                }}
                            >
                                <ThemedText style={styles.replyText}>Balas</ThemedText>
                            </TouchableOpacity>

                            {grouped[reply.id] && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setExpanded((prev) => ({
                                            ...prev,
                                            [reply.id]: !prev[reply.id],
                                        }))
                                    }
                                >
                                    <ThemedText style={styles.viewReplyBtn}>
                                        {expanded[reply.id]
                                            ? "Sembunyikan balasan"
                                            : `Lihat balasan (${grouped[reply.id].length})`}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {level < 2 && renderReplies(reply.id, level + 1)}
                </View>
            </View>
        ));
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.modalWrapper}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* BACKDROP */}
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

                {/* BOTTOM SHEET */}
                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* DRAG INDICATOR */}
                    <View style={styles.dragIndicator} />

                    {/* LIST */}
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {(grouped[0] || []).map((comment) => (
                            <View key={comment.id}>
                                <View style={styles.commentRow}>
                                    <Image
                                        source={
                                            comment.user.profilePicture
                                                ? { uri: comment.user.profilePicture }
                                                : undefined
                                        }
                                        style={styles.avatar}
                                    />

                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={styles.username}>
                                            {comment.user.fullName}
                                        </ThemedText>

                                        <ThemedText style={styles.commentContent}>
                                            {comment.content}
                                        </ThemedText>

                                        <View style={styles.replyActions}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setReplyTo(comment);
                                                    inputRef.current?.focus();
                                                }}
                                            >
                                                <ThemedText style={styles.replyText}>Balas</ThemedText>
                                            </TouchableOpacity>

                                            {grouped[comment.id] && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setExpanded((prev) => ({
                                                            ...prev,
                                                            [comment.id]: !prev[comment.id],
                                                        }))
                                                    }
                                                >
                                                    <ThemedText style={styles.viewReplyBtn}>
                                                        {expanded[comment.id]
                                                            ? "Sembunyikan balasan"
                                                            : `Lihat balasan (${grouped[comment.id].length})`}
                                                    </ThemedText>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {renderReplies(comment.id, 1)}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* INPUT BAR */}
                    <View style={styles.inputBar}>
                        {replyTo && (
                            <ThemedText style={styles.replyingInfo}>
                                Membalas {replyTo.user.fullName}
                            </ThemedText>
                        )}

                        <View style={styles.inputRow}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                placeholder="Tulis komentar..."
                                placeholderTextColor="#777"
                                value={newComment}
                                onChangeText={setNewComment}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    submitComment(replyTo?.id ?? null);
                                    setReplyTo(null);
                                    Keyboard.dismiss();
                                }}
                            >
                                <ThemedText style={styles.sendBtn}>Kirim</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        height: SCREEN_HEIGHT * 0.85,
        backgroundColor: "#111",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 8,
        paddingHorizontal: 12,
    },

    dragIndicator: {
        width: 42,
        height: 5,
        backgroundColor: "#444",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 10,
    },

    commentRow: {
        flexDirection: "row",
        marginBottom: 18,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },

    username: {
        fontWeight: "700",
        fontSize: 14,
        marginBottom: 4,
    },

    commentContent: {
        fontSize: 13,
        color: "#ccc",
    },

    replyActions: {
        flexDirection: "row",
        marginTop: 6,
        gap: 14,
    },

    replyText: {
        fontSize: 12,
        color: "#1d9bf0",
    },

    viewReplyBtn: {
        fontSize: 12,
        color: "#888",
    },

    inputBar: {
        padding: 10,
        borderTopWidth: 0.4,
        borderTopColor: "#333",
        backgroundColor: "#111",
    },

    replyingInfo: {
        fontSize: 12,
        color: "#aaa",
        marginBottom: 4,
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    input: {
        flex: 1,
        backgroundColor: "#222",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: "#fff",
    },

    sendBtn: {
        color: "#1d9bf0",
        fontWeight: "700",
        fontSize: 14,
    },
});
