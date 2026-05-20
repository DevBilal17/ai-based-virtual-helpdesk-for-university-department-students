import React, { useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import QrScanner from "../../components/QR/QrScanner";
import QrShow from "../../components/QR/QrShow";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function QrScreen() {
  const [tab, setTab] = useState("scan");
const [showInfoModal, setShowInfoModal] = useState(false);
  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <LinearGradient
          colors={["rgba(15,20,35,0.85)", "rgba(10,15,30,0.65)"]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="qr-code-outline" size={20} color="#635BFF" />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.smallText}>QR SYSTEM</Text>
            <Text style={styles.title}>Scan QR Code</Text>
          </View>

       <TouchableOpacity
  style={styles.iconBtn}
  onPress={() => setShowInfoModal(true)}
>
             <Ionicons
              name="information-circle-outline"
              size={20}
              color="white"
            /> 
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>

      {/* ================= CONTENT ================= */}
      <View style={styles.content}>
        {tab === "scan" ? <QrScanner /> : <QrShow />}
      </View>
<Modal
  visible={showInfoModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowInfoModal(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setShowInfoModal(false)}
  >
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modalCard}
    >
      <View style={styles.modalHeader}>
        <Ionicons
          name="information-circle"
          size={26}
          color="#7C7CFF"
        />

        <Text style={styles.modalTitle}>
          QR Navigation Guide
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons
          name="scan-circle-outline"
          size={18}
          color="#7C7CFF"
        />

        <Text style={styles.infoText}>
          Scan QR code placed outside rooms or offices.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons
          name="navigate-outline"
          size={18}
          color="#7C7CFF"
        />

        <Text style={styles.infoText}>
          Scan QR code to set your starting location automatically.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons
          name="location-outline"
          size={18}
          color="#7C7CFF"
        />

        <Text style={styles.infoText}>
          Select destination location to generate shortest path.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons
          name="map-outline"
          size={18}
          color="#7C7CFF"
        />

        <Text style={styles.infoText}>
          Indoor navigation map will guide you step-by-step.
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons
          name="close-circle-outline"
          size={18}
          color="#7C7CFF"
        />

        <Text style={styles.infoText}>
          Tap outside this popup to close it.
        </Text>
      </View>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
    </View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },

  content: {
    flex: 1,
    marginTop: 90, // header space
    paddingHorizontal: 10,
  },

  overlay: {
    position: "absolute",
    width: "100%",
    zIndex: 100,
  },

  header: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(10,15,30,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  centerContent: {
    alignItems: "center",
  },

  smallText: {
    color: "#7C7CFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
},

modalCard: {
  width: "100%",
  borderRadius: 28,
  padding: 22,

  backgroundColor: "rgba(18,25,45,0.96)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},

modalHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 22,
},

modalTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "700",
  marginLeft: 10,
},

infoItem: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 18,
},

infoText: {
  color: "rgba(255,255,255,0.82)",
  fontSize: 15,
  lineHeight: 22,
  marginLeft: 12,
  flex: 1,
},
});