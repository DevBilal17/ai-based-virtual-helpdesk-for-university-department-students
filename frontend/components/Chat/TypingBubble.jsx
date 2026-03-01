import { Text } from "react-native";
import { View } from "react-native";
import TypingDots from "./TypingDots";

const TypingBubble = () => {
  return (
    <View
      style={{
        backgroundColor: "#36383D",
        padding: 12,
        borderRadius: 10,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "70%",
      }}
    >
      <Text style={{ color: "#aaa", fontSize: 14 }}>
        AI is typing
      </Text>
    <TypingDots/>
    </View>
  );
};

export default TypingBubble