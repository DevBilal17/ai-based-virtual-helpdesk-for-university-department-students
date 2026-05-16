import React from "react";
import { View, StyleSheet } from "react-native";
import FloorMap from "../../assets/maps/floor.svg";

export default function DeptMap() {
  return (
    <View style={styles.container}>
      
   <FloorMap
  width="100%"
  height="100%"
  preserveAspectRatio="xMidYMid slice"
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    overflow: "hidden",
  },
});