import { Link, Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      {/* Hide default header */}
      <Stack.Screen
        options={{
          title: "Oops!",
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        {/* Error Icon */}
        <Ionicons
          name="alert-circle-outline"
          size={80}
          color="#635BFF"
        />

        {/* Error Code */}
        <Text style={styles.title}>404</Text>

        {/* Description */}
        <Text style={styles.subtitle}>
          This page doesn't exist or may have been moved.
        </Text>

        {/* Navigate Back Home */}
        <Link href="/" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.buttonPressed,
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go to Home Screen"
          >
            <Text style={styles.buttonText}>
              Go to Home Screen
            </Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1013",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 52,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#C8CACD",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: 320,
  },

  homeButton: {
    backgroundColor: "#635BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,

    shadowColor: "#635BFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,

    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});