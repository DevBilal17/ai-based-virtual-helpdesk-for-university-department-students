import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import TypingDots from "./TypingDots";

const TypingBubble = () => {
  return (
    <View style={styles.container}>
      {/* Small avatar icon to match MessageBox */}
      <Image 
        source={require("../../assets/icons/message-bot.png")} 
        style={styles.avatar} 
      />
      
      <View style={styles.bubble}>
        <Text style={styles.text}>AI is thinking</Text>
        <TypingDots color="#00ffcc" dotSize={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    alignSelf: "flex-start",
    gap: 8,
    marginVertical: 5,
  },
  avatar: {
    height: 24,
    width: 24,
    borderRadius: 12,
    opacity: 0.6, // Slightly faded because it's not a full message yet
  },
  bubble: {
    backgroundColor: "#2C2E33", // Match your botBubble color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4, // Sharp corner like the real message
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 204, 0.15)", // Subtle AI glow
  },
  text: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default TypingBubble;