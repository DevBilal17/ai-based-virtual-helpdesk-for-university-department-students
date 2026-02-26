import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";
import { setItem } from "../../utils/asyncStorage";
import { router } from "expo-router";

const DoneButtonComponent = () => {
   const handleDone = () => {
      setItem("onboardingCompleted", "true");
       router.replace("/login"); // ← use replace to prevent back navigation
    };
  return (
    <TouchableOpacity onPress={handleDone}>
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
