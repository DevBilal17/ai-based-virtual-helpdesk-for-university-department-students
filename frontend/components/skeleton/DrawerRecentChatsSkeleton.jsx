import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonBox = ({ width, height, style }) => {
  return <View style={[styles.skeleton, { width, height }, style]} />;
};

const DrawerChatsSkeleton = () => {
  return (
    <View>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.chatItem}>
          <SkeletonBox width={18} height={18} style={{ borderRadius: 4 }} />

          <SkeletonBox
            width={"80%"}
            height={12}
            style={{ borderRadius: 6 }}
          />
        </View>
      ))}
    </View>
  );
};

export default DrawerChatsSkeleton;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  skeleton: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});