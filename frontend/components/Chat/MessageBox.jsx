import { View, Text, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import TypeWriter from "react-native-typewriter";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MessageBox = ({
  isUser,
  image,
  question,
  answer,
  isTyping = false,
}) => {
  const [typing, setTyping] = useState(0);

  useEffect(() => {
    if (!isUser && isTyping) {
      setTyping(1); // start typing animation
    }
  }, [isTyping]);

  return (
    <View
      style={{
        backgroundColor: "#36383D",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: isUser ? 10 : 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: isUser ? 0 : 10,
        flexDirection: "row",
        gap: 12,
        padding: 10,
        maxWidth: SCREEN_WIDTH * 0.9,
        minWidth: 120,
        alignSelf: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Image
        source={image}
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />

      <View style={{ gap: 6, flexShrink: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#aaa",
          }}
        >
          {isUser ? "You" : "AI Helpdesk"}
        </Text>

        {isUser ? (
          <Text
            style={{
              fontSize: 16,
              color: "#fff",
            }}
          >
            {question}
          </Text>
        ) : (
          <TypeWriter
            typing={typing}
            maxDelay={20} // speed
            style={{
              fontSize: 16,
              color: "#fff",
            }}
          >
            {answer}
          </TypeWriter>
        )}
      </View>
    </View>
  );
};

export default MessageBox;