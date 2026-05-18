import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import QrScanner from "../../components/QR/QrScanner";
import QrShow from "../../components/QR/QrShow";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function QrScreen() {
  const [tab, setTab] = useState("scan");

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

          <TouchableOpacity style={styles.iconBtn}>
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
});