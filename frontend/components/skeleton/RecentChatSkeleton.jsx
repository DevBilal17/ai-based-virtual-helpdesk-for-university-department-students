import React from "react";
import { View, StyleSheet } from "react-native";
import GlassmorphismCard from "../GlassmorphismCard/GlassmorphismCard";
import SkeletonBox from "./SkeletonBox";

const RecentChatSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <GlassmorphismCard
          key={item}
          style={styles.card}
        >
          <View style={styles.row}>
            <SkeletonBox
              width={45}
              height={45}
              style={{ borderRadius: 12 }}
            />

            <View style={{ flex: 1, gap: 8 }}>
              <SkeletonBox
                width="70%"
                height={10}
                style={{ borderRadius: 6 }}
              />
              <SkeletonBox
                width="90%"
                height={10}
                style={{ borderRadius: 6 }}
              />
            </View>

            <SkeletonBox
              width={40}
              height={10}
              style={{ borderRadius: 6 }}
            />
          </View>
        </GlassmorphismCard>
      ))}
    </View>
  );
};

export default RecentChatSkeleton;

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  card: {
    borderRadius: 24,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
  },
});