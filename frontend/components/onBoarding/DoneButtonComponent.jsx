import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

const DoneButtonComponent = () => {
  return (
    <TouchableOpacity>
      <LinearGradient
        colors={["#023E8A", "#011024"]}
        style={{
          padding: 20,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Get Started</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default DoneButtonComponent;
