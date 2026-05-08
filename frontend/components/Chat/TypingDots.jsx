import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const Dot = ({ delay, color = "#00ffcc" }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.4); // Start slightly faded

  useEffect(() => {
    // Movement Animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      )
    );

    // Opacity Animation (Adds a "pulsing" feel)
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.4, { duration: 400 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />;
};

const TypingDots = ({ color }) => {
  return (
    <View style={styles.container}>
      <Dot delay={0} color={color} />
      <Dot delay={200} color={color} />
      <Dot delay={400} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", // Center aligned looks better next to text
    gap: 4,
    marginLeft: 8,
  },
  dot: {
    width: 6, // Slightly smaller dots look more modern
    height: 6,
    borderRadius: 3,
  },
});

export default TypingDots;