import React, { useRef } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryComment } from "@/lib/types/model";

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    comments: GalleryComment[];
    newComment: string;
    setNewComment: (val: string) => void;
    submitComment: () => Promise<void> | void;
}

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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ThemedView style={styles.inner}>
                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>Komentar</ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <ThemedText style={styles.closeBtn}>Tutup</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* List komentar */}
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 80 }}
                    >
                        {comments.length === 0 ? (
                            <ThemedText style={{ textAlign: "center", marginTop: 30 }}>
                                Belum ada komentar
                            </ThemedText>
                        ) : (
                            comments.map((c) => (
                                <View key={c.id} style={styles.commentBox}>
                                    <ThemedText style={styles.username}>
                                        {c.user.fullName}
                                    </ThemedText>
                                    <ThemedText style={styles.content}>{c.content}</ThemedText>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Input komentar */}
                    {user && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                value={newComment}
                                onChangeText={setNewComment}
                                placeholder="Tulis komentar..."
                                placeholderTextColor="#888"
                                onSubmitEditing={() => {
                                    submitComment();
                                    Keyboard.dismiss();
                                }}
                            />
                            <TouchableOpacity onPress={submitComment}>
                                <ThemedText style={styles.sendBtn}>Kirim</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </ThemedView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, padding: 10 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    closeBtn: {
        color: "#1d9bf0",
        fontWeight: "600",
    },
    commentBox: {
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: 8,
    },
    username: { fontWeight: "600" },
    content: { marginTop: 4 },
    inputContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#111",
        borderTopWidth: 0.5,
        borderTopColor: "#333",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 8,
        paddingHorizontal: 10,
        color: "#fff",
    },
    sendBtn: {
        color: "#1d9bf0",
        fontWeight: "600",
        marginLeft: 8,
    },
});
