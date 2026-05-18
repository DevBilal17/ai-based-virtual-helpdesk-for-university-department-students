import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QrShow() {
  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={styles.card}>
          <Text style={styles.text}>Room QR {item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    padding: 10,
  },

  card: {
    width: "48%",
    height: 120,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "white",
    fontWeight: "600",
  },
});