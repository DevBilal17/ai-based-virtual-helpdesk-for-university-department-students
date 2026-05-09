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
import { useGetUserChatsQuery } from "../../store/services/chatApi";
import GlassmorphismCard from "../GlassmorphismCard/GlassmorphismCard";
import { setItem } from "../../utils/asyncStorage";
import { useRouter } from "expo-router";

const CustomDrawer = (props) => {
  const { data, isLoading } = useGetUserChatsQuery();
  const userChats = data?.data?.chats || [];
  const router = useRouter();
  //    console.log(userChats)
  const handleSelectChat = async (chat) => {
    await setItem("active_chat_id", chat._id);

    props.navigation.closeDrawer();

    router.push({
  pathname: "/(tabs)/chat",
  params: { chatId: chat._id }
}); 
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AI Desk</Text>

        <Text style={styles.subtitle}>Smart Campus Assistant</Text>
      </View>

      {/* New Chat */}
      <TouchableOpacity style={styles.newChatBtn}>
        <GlassmorphismCard
          style={styles.newChatCard}
          gradientStyle={styles.newChatGradient}
        >
          <Ionicons name="add" size={20} color="white" />

          <Text style={styles.newChatText}>New Chat</Text>
        </GlassmorphismCard>
      </TouchableOpacity>

      {/* Chats */}
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
                name="chatbubble-ellipses-outline"
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

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1013",
    padding: 18,
  },

  header: {
    marginTop: 20,
    marginBottom: 30,
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

  newChatBtn: {
    marginBottom: 30,
  },

  newChatCard: {
    borderRadius: 18,
    overflow: "hidden",
  },

  newChatGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },

  newChatText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  chatSection: {
    marginTop: 10,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.4)",
    marginBottom: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  chatTitle: {
    color: "white",
    flex: 1,
    fontSize: 14,
  },
});
