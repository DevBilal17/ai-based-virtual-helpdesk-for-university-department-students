import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MessageBox = ({isUser,image,question,answer}) => {
  
 
  return (
    <View
      style={{
        backgroundColor: "#36383D",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: isUser ? 10 : 0,
        borderTopRightRadius:  10,
        borderBottomRightRadius: isUser ? 0 : 10,
        flexDirection: "row",
        gap: 12,
        padding: 8,
        // important for width
        maxWidth: SCREEN_WIDTH * 0.9, // max 90% of screen
        minWidth: 120, // minimum width
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
      <View style={{ gap: 6,flexShrink:1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            fontFamily: "Roboto",
            color: "#fff",
          }}
        >
          {isUser ? "You":"AI Helpdesk"}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            fontFamily: "Roboto",
            color: "#fff",
          }}
        >
          {isUser ? question : answer}
        </Text>
      </View>
    </View>
  );
};

export default MessageBox;