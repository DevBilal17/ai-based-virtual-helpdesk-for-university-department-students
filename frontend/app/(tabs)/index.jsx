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
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassmorphismCard from "../../components/GlassmorphismCard/GlassmorphismCard";
import { Ionicons } from "@expo/vector-icons";
import ModuleBox from "../../components/Home/ModuleBox";
import HistoryChatBox from "../../components/Home/HistoryChatBox";
import { router } from "expo-router";
import { Alert } from "react-native";
import { removeItem } from "../../utils/asyncStorage";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await removeItem("loggedIn");
          await removeItem("active_chat_id");
          router.replace("/login");
        },
      },
    ]);
  };

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

            <TouchableOpacity onPress={handleLogout}>
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
                <Text style={styles.greetingText}>
                  Hi, {user?.name?.split(" ")[0]}
                </Text>
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
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

             <View style={styles.historyListContainer}>
               <GlassmorphismCard
                style={styles.historyListCard}
                gradientStyle={styles.historyListGradient}
              >
                <HistoryChatBox title="Attendance Policy Query" date="Today" />
              </GlassmorphismCard>

              <GlassmorphismCard>
                <HistoryChatBox
                  title="Library Working Hours"
                  date="Yesterday"
                />
              </GlassmorphismCard>
              <GlassmorphismCard>
                <HistoryChatBox title="Fee Structure 2026" date="2 days ago" />
              </GlassmorphismCard>
             </View>
            </View>
          </ScrollView>
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
  historyListContainer:{
    display:"flex",
    gap:12
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 5,
  },
});

export default Home;
