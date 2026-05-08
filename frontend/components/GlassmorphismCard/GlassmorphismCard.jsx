import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const GlassmorphismCard = ({ children, style, gradientStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={15} style={styles.glass}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.02)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient,gradientStyle]}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

export default GlassmorphismCard;

const styles = StyleSheet.create({
  container: {
    // Remove maxWidth and width: 100% for small icons
    // These should be handled by the 'style' prop passed from Home.js
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
    overflow: "hidden",
  },
  glass: {
    // flex: 1, // Ensure BlurView fills the container
    width:'100%'
  },
  gradient: {
    // FIX: If you use this for a small icon, 26px vertical padding is TOO MUCH.
    // It will push the icon away. Let's make this flexible.
    paddingHorizontal: 10, 
    paddingVertical: 10, 
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: 'center', // Center icons automatically
    justifyContent: 'center', // Center icons automatically
  },
});