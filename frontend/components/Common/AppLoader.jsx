import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
} from "react-native";

import GlassmorphismCard from "../GlassmorphismCard/GlassmorphismCard";
import AIVisualizer from "../Chat/AIVisualizer";

const AppLoader = ({
  visible = false,
  title = "Thinking...",
  subtitle = "AI is processing your request",
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <GlassmorphismCard
          style={styles.card}
          gradientStyle={styles.gradient}
        >
          {/* AI Animation */}
          <View style={styles.visualizer}>
            <AIVisualizer isTyping={true} />
          </View>

          {/* Loader Text */}
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </GlassmorphismCard>
      </View>
    </Modal>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
  },

  gradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,

    alignItems: "center",
  },

  visualizer: {
    height: 140,
    width: 140,

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",

    marginTop: 10,
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,

    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
});