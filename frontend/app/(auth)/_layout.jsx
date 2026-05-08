import { Stack } from "expo-router";
import { View, StyleSheet, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      {/* 1. Global Status Bar for Auth Screens */}
      <StatusBar style="light" />

      {/* 2. Optional: Global Background Image for all Auth Screens */}
      {/* <ImageBackground 
        source={require("../../assets/images/auth-bg.png")} 
        style={StyleSheet.absoluteFill} 
        resizeMode="cover"
      /> */}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0C1013" }, // Your dark theme
          animation: "fade_from_bottom", // Professional transition
        }}
      >
        {/* These names must match your filenames in the (auth) folder */}
        <Stack.Screen name="login" />
        <Stack.Screen name="verificationcode" />
        <Stack.Screen name="resetpassword" />
        <Stack.Screen name="newpassword" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1013",
  },
});