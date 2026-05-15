import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import GlassmorphismCard from "../GlassmorphismCard/GlassmorphismCard";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useGetUserChatsQuery } from "../../store/services/chatApi";
import {
  clearChat,
  setActiveChatId,
  setLoadingHistory,
} from "../../store/slices/chatSlice";
import { removeItem, setItem } from "../../utils/asyncStorage";

const CustomAIDrawer = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data } = useGetUserChatsQuery();
  const userChats = data?.data?.chats || [];

  // 🧠 SELECT CHAT
  const handleSelectChat = async (chat) => {
    dispatch(setLoadingHistory(true));
    dispatch(setActiveChatId(chat._id));
    await setItem("active_chat_id", chat._id);

    props.navigation.closeDrawer();

    router.push({
      pathname: "/(tabs)/chat",
      params: { chatId: chat._id },
    });
  };

  // ➕ NEW CHAT
  const handleNewChat = async () => {
    await removeItem("active_chat_id");

    dispatch(clearChat());

    props.navigation.closeDrawer();

    router.push("/(tabs)/chat");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* 🧠 HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>AI Desk</Text>
        <Text style={styles.subtitle}>Campus AI Assistant</Text>
      </View>

      {/* ⚡ AI STATUS */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>AI SYSTEM ONLINE</Text>
        </View>
        <Text style={styles.statusSub}>
          Ready to assist your campus tasks
        </Text>
      </View>

      {/* ➕ NEW CHAT */}
      <TouchableOpacity onPress={handleNewChat}>
        <GlassmorphismCard style={styles.newChatCard}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.newChatText}>New Chat</Text>
        </GlassmorphismCard>
      </TouchableOpacity>

      {/* ⚡ QUICK ACTIONS */}
      <View style={styles.quickSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickBox}>
            <Ionicons name="mic" size={18} color="white" />
            <Text style={styles.quickText}>Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox}>
            <Ionicons name="globe" size={18} color="white" />
            <Text style={styles.quickText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox}>
            <Ionicons name="location" size={18} color="white" />
            <Text style={styles.quickText}>Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox}>
            <Ionicons name="sparkles" size={18} color="white" />
            <Text style={styles.quickText}>AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💬 RECENT CHATS */}
      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>

        <FlatList
          data={userChats}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => handleSelectChat(item)}
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color="rgba(255,255,255,0.7)"
              />
              <Text numberOfLines={1} style={styles.chatTitle}>
                {item.title || "Untitled Chat"}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomAIDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1013",
    padding: 18,
  },

  header: {
    marginTop: 20,
    marginBottom: 20,
  },

  logo: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 5,
  },

  statusCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  pulseDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  statusSub: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 6,
    fontSize: 12,
  },

  newChatCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  newChatText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 10,
  },

  quickSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  quickBox: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  quickText: {
    color: "white",
    fontWeight: "600",
  },

  chatSection: {
    marginTop: 10,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  chatTitle: {
    color: "white",
    flex: 1,
    fontSize: 14,
  },
});