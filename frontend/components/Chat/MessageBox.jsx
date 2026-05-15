import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import TypeWriter from "react-native-typewriter";
import Markdown from "react-native-markdown-display";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MessageBox = ({
  isUser,
  image,
  question,
  answer,
  shouldAnimate = false,
}) => {
const [typing, setTyping] = useState(0);

useEffect(() => {
  if (!isUser && shouldAnimate) {
    setTyping(1); // only animate NEW messages
  } else {
    setTyping(0); // history → no animation
  }
}, [answer, shouldAnimate]);

  return (
    <View
      style={[
        styles.bubbleContainer,
        isUser ? styles.userBubble : styles.botBubble,
      ]}
    >
      {/* 1. Show AI Avatar on the LEFT */}
      {!isUser && (
        <Image source={image} style={styles.avatar} resizeMode="cover" />
      )}

      <View style={{ gap: 4, flex: 1 }}>
        <Text style={[styles.senderName, { textAlign: isUser ? "right" : "left" }]}>
          {isUser ? "You" : "AI Assistant"}
        </Text>

       {isUser ? (
  <Text style={styles.messageText}>{question}</Text>
) : shouldAnimate ? (
  <TypeWriter typing={1} maxDelay={15}>
    {answer}
  </TypeWriter>
) : (
  <Markdown style={markdownStyles}>
  {answer}
</Markdown>
)}
      </View>

      {/* 2. Show User Avatar on the RIGHT */}
      {isUser && (
        <Image source={image} style={styles.avatar} resizeMode="cover" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    maxWidth: SCREEN_WIDTH * 0.85,
    borderRadius: 20,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#1E2022", // Darker, sleek charcoal
    borderBottomRightRadius: 4, // Sharp corner for user
    borderWidth: 1,
    borderColor: "#2A2D30",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#2C2E33", // Slightly lighter to distinguish
    borderBottomLeftRadius: 4, // Sharp corner for bot
    borderWidth: 1,
    borderColor: "rgba(0, 255, 204, 0.2)", // Subtle AI-themed glow border
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    marginTop: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00ffcc", // Electric cyan for names to look "techy"
    marginBottom: 2,
    opacity: 0.8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#fff",
  },
});
const markdownStyles = {
  body: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },

  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffcc",
  },

  heading2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00ffcc",
  },

  code_inline: {
    backgroundColor: "#333",
    padding: 4,
    borderRadius: 4,
    fontFamily: "monospace",
  },

  fence: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 10,
  },
};


export default MessageBox;