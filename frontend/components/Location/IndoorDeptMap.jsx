import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import FloorMap from "../../assets/maps/floor_1.svg";
import { RAW_CONNECTIONS, NODES, ROOMS, CORRIDORS } from "../../utils/constants";
import { findPath, makeConnectionsBidirectional } from "../../utils/mapFunctions";

import Svg, { Polyline } from "react-native-svg";

export default function IndoorDeptMap() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [route, setRoute] = useState([]);
  
  // Sahi Navigation k liye dono states ka hona zaroori hai
  const [startRoom, setStartRoom] = useState(null); 
  const [endRoom, setEndRoom] = useState(null);

  // ================= CAMERA =================
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);

  // ================= GESTURES =================
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(
        0.6,
        Math.min(startScale.value * e.scale, 3)
      );
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const gesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    doubleTap
  );

  // ================= FOCUS ROOM =================
  const focusRoom = (room) => {
    scale.value = withTiming(2, { duration: 400 });
    translateX.value = withTiming(-room.x + 200);
    translateY.value = withTiming(-room.y + 300);
  };

  // ================= ROUTE POINTS (OPTIMIZED) =================
  const routePoints = useMemo(() => {
    return route
      .map((id) => NODES.find((n) => n.id === id))
      .filter(Boolean);
  }, [route]);

  // ================= CAMERA STYLE =================
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  const CONNECTIONS = makeConnectionsBidirectional(RAW_CONNECTIONS)
  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>

        <Animated.View style={animatedStyle}>

          {/* ================= BACKGROUND MAP ================= */}
          <FloorMap width={1200} height={1200} />

          {/* ================= STATIC CORRIDORS ================= */}
          <Svg
            width={1200}
            height={1200}
            style={StyleSheet.absoluteFill}
          >
            {CORRIDORS.map((c) => (
              <Polyline
                key={c.id}
                points={c.points.map(p => `${p.x},${p.y}`).join(" ")}
                stroke="#2A2F45"
                strokeWidth={4}
                fill="none"
              />
            ))}
          </Svg>

          {/* ================= ACTIVE ROUTE ================= */}
          {routePoints.length > 1 && (
            <Svg
              width={1200}
              height={1200}
              style={StyleSheet.absoluteFill}
            >
              <Polyline
                points={routePoints
                  .map(p => `${p.x},${p.y}`)
                  .join(" ")}
                stroke="#00F5D4"
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}

          {/* ================= ROOMS ================= */}
          {ROOMS.map((room) => {
            // Room tab highlighted hoga agar wo Start ya End me se koi ek ho
            const isSelected = startRoom === room.id || endRoom === room.id;

            return (
              <View
                key={room.id}
                style={[
                  styles.roomPin,
                  {
                    left: room.x,
                    top: room.y,
                    backgroundColor: isSelected
                      ? "#00F5D4" // Active points k liye color
                      : "#635BFF",
                    transform: [
                      { scale: isSelected ? 1.2 : 1 },
                    ],
                  },
                ]}
              >
                <Text
                  onPress={() => {
                    setSelectedRoom(room.id);

                    // --- JADUI LOGIC YAHAN HAI ---
                    if (!startRoom) {
                      // 1. Agar kuch select nahi hai, to pehla click START point hoga
                      setStartRoom(room.id);
                      setRoute([]); // Purana rasta saaf karein
                    } else if (startRoom && !endRoom) {
                      // 2. Agar start mil gaya hai to dusra click END point hoga
                      setEndRoom(room.id);
                      
                      // Rasta nikaalein: startRoom se lekar abhi click kiye gaye room tak
                      const path = findPath(
                        startRoom,
                        room.id,
                        CONNECTIONS
                      );
                      setRoute(path);
                    } else {
                      // 3. Agar teesri baar click ho, to ise naya START bana dein aur cycle reset karein
                      setStartRoom(room.id);
                      setEndRoom(null);
                      setRoute([]);
                    }

                    focusRoom(room);
                  }}
                  style={styles.roomText}
                >
                  {room.name}
                </Text>
              </View>
            );
          })}

        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    overflow: "hidden",
  },
  roomPin: {
    position: "absolute",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    elevation: 10,
  },
  roomText: {
    color: "white",
    fontSize: 6,
    fontWeight: "600",
  },
});