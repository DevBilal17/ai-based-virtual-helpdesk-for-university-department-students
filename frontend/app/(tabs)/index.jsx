import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import { Ionicons } from "@expo/vector-icons";
import ModuleBox from "../../components/Home/ModuleBox";
import HistoryChatBox from "../../components/Home/HistoryChatBox";
import { router } from "expo-router";

import { removeItem } from "../../utils/asyncStorage";
import { useSelector } from "react-redux";
import { useGetRecentChatsQuery } from "../../store/services/chatApi";
import { FlatList } from "react-native";
import EmptyState from "../../components/EmptyState";
const { width } = Dimensions.get("window");

const Home = () => {
  const user = useSelector((state) => state.auth.user);
const [showLogout, setShowLogout] = useState(false);
 const handleLogout = async () => {
  await removeItem("loggedIn");
  await removeItem("token");
  await removeItem("user");
  await removeItem("active_chat_id");
  router.replace("/login");
};

  const formatDateTime = (date) => {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    let hours = d.getHours();
    const minutes = d.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    // convert 24h → 12h format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    return {
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      hours,
      minutes,
      ampm,
    };
  };
  const { data, isLoading, isFetching, isError } = useGetRecentChatsQuery();

  // console.log(JSON.stringify(data));
  const recentChats = data?.data?.chats || [];
  return (
    // Updated background logic to match your dark navy theme
    <View style={{ flex: 1, backgroundColor: "#0C1013" }}>
      <ImageBackground
        source={require("../../assets/images/on-boarding-bg-1.png")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.4 }} // Lowered opacity to make the UI pop
        blurRadius={Platform.OS === "ios" ? 60 : 30}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.headerViewContainer}>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <GlassmorphismCard
                style={styles.headerIconCard}
                gradientStyle={styles.headerIconGradient}
              >
                <Ionicons name="grid-outline" size={20} color="white" />
              </GlassmorphismCard>
            </TouchableOpacity>

            <View style={styles.onlineStatusContainer}>
              <View style={styles.pulseDot} />
              <Text style={styles.onlineText}>AI SYSTEM ONLINE</Text>
            </View>

            <TouchableOpacity onPress={() => setShowLogout(true)}>
              <GlassmorphismCard
                style={styles.headerIconCard}
                gradientStyle={styles.headerIconLogoutGradient}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </GlassmorphismCard>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Greeting */}
            <View style={styles.greetingContainer}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingText}>Hi, {user?.name}</Text>
                <Image
                  source={require("../../assets/icons/hand.png")}
                  style={styles.handIcon}
                />
              </View>
              <Text style={styles.subGreetingText}>
                AI Desk is ready to assist you.
              </Text>
            </View>

            {/* Premium Module Grid */}
            <View style={styles.moduleGridContainer}>
              <ModuleBox
                image={"speaking"}
                style={styles.largeModule}
                // Using your brand purple with a deep navy mix
                gradientColors={["#635BFF", "#1C2D47"]}
                text={"Voice\nInteraction"}
                onPress={() => router.push("/voice")}
              />

              <View style={styles.smallModuleColumn}>
                <ModuleBox
                  image={"communication"}
                  style={styles.smallModule}
                  gradientColors={["#1C2D47", "#2E3B52"]}
                  text={"Chat Helper"}
                  onPress={() => router.push("/chat")}
                />
                <ModuleBox
                  image={"address"}
                  style={styles.smallModule}
                  gradientColors={["#1C2D47", "#2E3B52"]}
                  text={"Find Office"}
                  onPress={() => router.push("/location")}
                />
              </View>
            </View>

            {/* History Section */}
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Recent Conversations</Text>
                {/* <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity> */}
              </View>

              <FlatList
                data={recentChats}
                scrollEnabled={false}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.historyListContainer}
                ListEmptyComponent={
                  !isLoading && (
                    <EmptyState
                      icon="chatbubbles-outline"
                      title="No Conversations Found"
                      message="Start a new chat or voice interaction to see your history here."
                    />
                  )
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/chat",
                        params: { chatId: item._id },
                      })
                    }
                  >
                    <GlassmorphismCard style={styles.historyListCard}>
                      <HistoryChatBox
                        title={item.title || "Untitled Chat"}
                        message={item?.messages[1]?.text || ""}
                        date={formatDateTime(item.updatedAt)}
                      />
                    </GlassmorphismCard>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              />
            </View>
          </ScrollView>

          {showLogout && (
  <TouchableOpacity
    style={styles.overlay}
    activeOpacity={1}
    onPress={() => setShowLogout(false)}
  >
    <TouchableOpacity activeOpacity={1} style={styles.alertBox}>
      <Ionicons name="log-out-outline" size={40} color="#EF4444" />

      <Text style={styles.alertTitle}>Logout</Text>
      <Text style={styles.alertMsg}>
        Are you sure you want to sign out?
      </Text>

      <View style={styles.alertBtns}>
        <TouchableOpacity
          style={[styles.alertBtn, { backgroundColor: "#1C2D47" }]}
          onPress={() => setShowLogout(false)}
        >
          <Text style={{ color: "#fff" }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.alertBtn, { backgroundColor: "#EF4444" }]}
          onPress={handleLogout}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
)}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "100%",
  },
  headerIconCard: { borderRadius: 14, height: 48, width: 48 },
  headerIconGradient: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconLogoutGradient: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },

  onlineStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1C2D47",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pulseDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 8,
  },
  onlineText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 1,
  },

  greetingContainer: { marginBottom: 30 },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  handIcon: { width: 30, height: 30 },
  greetingText: { fontSize: 32, color: "#fff", fontWeight: "800" },
  subGreetingText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    marginTop: 5,
    fontWeight: "500",
  },

  moduleGridContainer: { flexDirection: "row", gap: 15, height: 252 },
  largeModule: { height: 250, flex: 1.2, borderRadius: 28 },
  smallModuleColumn: { flex: 1, gap: 15 },
  smallModule: { flex: 1, borderRadius: 22 },

  historyContainer: { marginTop: 20 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, color: "#fff", fontWeight: "700" },
  seeAllText: { fontSize: 14, color: "#635BFF", fontWeight: "700" },

  // New Styles for History Container
  historyListCard: { borderRadius: 24, overflow: "hidden" },
  historyListGradient: { padding: 15 },
  historyListContainer: {
    display: "flex",
    // gap: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 5,
  },
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},

alertBox: {
  width: "85%",
  backgroundColor: "#0F172A",
  padding: 20,
  borderRadius: 20,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
},

alertTitle: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "700",
  marginTop: 10,
},

alertMsg: {
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
  marginVertical: 10,
},

alertBtns: {
  flexDirection: "row",
  gap: 10,
  marginTop: 15,
},

alertBtn: {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
},
});

export default Home;
