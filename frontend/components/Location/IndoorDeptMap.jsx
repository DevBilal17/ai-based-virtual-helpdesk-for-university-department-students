import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Defs, Filter, FeGaussianBlur, Polyline } from "react-native-svg";

import FloorMap from "../../assets/maps/floor_1.svg";
import { NODES, ROOMS, CORRIDORS } from "../../utils/constants";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_SIZE = 1200;
const ROOM_SIZE = 20; // adjust based on your pin size
export default function IndoorDeptMap({
  startRoom,
  endRoom,
  route,
  setStartRoom,
  setEndRoom,
}) {
  //   const INITIAL_X = (SCREEN_WIDTH - MAP_SIZE) / 2;
  // const INITIAL_Y = (SCREEN_HEIGHT - MAP_SIZE) / 2;

  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  });
  // const INITIAL_X = -MAP_SIZE / 2 + viewport.width / 2;
  // const INITIAL_Y = -MAP_SIZE / 2 + viewport.height / 2;
  useEffect(() => {
    if (viewport.width && viewport.height) {
      translateX.value = INITIAL.x;
      translateY.value = INITIAL.y;
    }
  }, [viewport]);
  const INITIAL = useMemo(() => {
    if (!viewport.width || !viewport.height) return { x: 0, y: 0 };

    return {
      x: -MAP_SIZE / 2 + viewport.width / 2,
      y: -MAP_SIZE / 2 + viewport.height / 2,
    };
  }, [viewport]);
  // ================= CAMERA & GESTURES =================
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScale = useSharedValue(1);

  // Pan Gesture Configuration
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
     
      const maxTx = (MAP_SIZE * scale.value - SCREEN_WIDTH) / 2;
      const maxTy = (MAP_SIZE * scale.value - SCREEN_HEIGHT) / 2;

      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    });

  // Pinch Gesture Configuration
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      cancelAnimation(scale);
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(0.6, Math.min(startScale.value * e.scale, 4));
    });

  // Double Tap to Reset
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 250 });

      translateX.value = withTiming(INITIAL.x, {
        duration: 250,
      });

      translateY.value = withTiming(INITIAL.y, {
        duration: 250,
      });
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture, doubleTap);

  // PERFECT CENTER FOCUS MATH
  // const focusRoom = (room) => {
  //   if (!viewport.width || !viewport.height) return;

  //   const targetScale = 2;

  //   const targetX =
  //     viewport.width / 2 - room.x * targetScale;

  //   const targetY =
  //     viewport.height / 2 - room.y * targetScale;

  //   scale.value = withTiming(targetScale, {
  //     duration: 350,
  //   });

  //   translateX.value = withTiming(targetX, {
  //     duration: 350,
  //   });

  //   translateY.value = withTiming(targetY, {
  //     duration: 350,
  //   });
  // };
  // const focusRoom = () => {
  //   scale.value = withTiming(
  //     scale.value < 2 ? 2 : 1,
  //     {
  //       duration: 350,
  //     }
  //   );
  // };
const focusRoom = (room) => {
  if (!room || !viewport.width || !viewport.height) return;

  const targetScale = 2;

  const targetX =
    viewport.width / 2 - (room.x + ROOM_SIZE / 2) * targetScale;

  const targetY =
    viewport.height / 2 - (room.y + ROOM_SIZE / 2) * targetScale;

  scale.value = withTiming(targetScale, { duration: 350 });
  translateX.value = withTiming(targetX, { duration: 350 });
  translateY.value = withTiming(targetY, { duration: 350 });
};
  // ================= OPTIMIZED ROUTE POINTS =================

  const pointsString = useMemo(() => {
    if (route.length < 2) return "";
    return route
      .map((id) => NODES.find((n) => n.id === id))
      .filter(Boolean)
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  }, [route]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={styles.container}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;

          setViewport({
            width,
            height,
          });
        }}
      >
        <View style={styles.viewport}>
          <Animated.View style={[styles.mapWrapper, animatedStyle]}>
            {/* Base Floor Map */}
            <FloorMap width={MAP_SIZE} height={MAP_SIZE} />

            {/* Static Corridors */}
            <Svg width={MAP_SIZE} height={MAP_SIZE} style={styles.absoluteSvg}>
              {CORRIDORS.map((c) => (
                <Polyline
                  key={c.id}
                  points={c.points.map((p) => `${p.x},${p.y}`).join(" ")}
                  stroke="#2A2F45"
                  strokeWidth={4}
                  fill="none"
                />
              ))}
            </Svg>

            {/* Active Route Line with Filters */}
            {pointsString.length > 0 && (
              <Svg
                width={MAP_SIZE}
                height={MAP_SIZE}
                style={styles.absoluteSvg}
              >
                <Defs>
                  <Filter
                    id="innerGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <FeGaussianBlur stdDeviation="3" result="blur" />
                  </Filter>
                  <Filter
                    id="outerGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <FeGaussianBlur stdDeviation="8" result="blur" />
                  </Filter>
                </Defs>

                {/* LAYER 1: Deep Outer Glow */}
                <Polyline
                  points={pointsString}
                  stroke="#5755EA"
                  strokeWidth={14}
                  opacity={0.3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#outerGlow)"
                />

                {/* LAYER 2: Soft Inner Glow */}
                <Polyline
                  points={pointsString}
                  stroke="#5755EA"
                  strokeWidth={8}
                  opacity={0.6}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#innerGlow)"
                />

                {/* LAYER 3: Main Core Line */}
                <Polyline
                  points={pointsString}
                  stroke="#9795FF"
                  strokeWidth={3.5}
                  opacity={1}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}

            {/* Rooms Pins */}
            {ROOMS.map((room) => {
              const isSelected = startRoom === room.id || endRoom === room.id;
              return (
                <View
                  key={room.id}
                  style={[
                    styles.roomPin,
                    {
                      left: room.x,
                      top: room.y,
                      backgroundColor: isSelected ? "#00F5D4" : "#635BFF",
                      transform: [{ scale: isSelected ? 1.15 : 1 }],
                    },
                  ]}
                >
                  <Text
                    onPress={() => {
                      if (!startRoom) {
                        setStartRoom(room.id);
                      } else if (startRoom && !endRoom) {
                        setEndRoom(room.id);
                      } else {
                        setStartRoom(room.id);
                        setEndRoom(null);
                      }
                      // focusRoom(room);
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
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    // overflow: "hidden"
  },
  viewport: {
    flex: 1,
    overflow: "hidden",
  },
  mapWrapper: {
    position: "absolute",
    width: MAP_SIZE,
    height: MAP_SIZE,
  },
  absoluteSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  roomPin: {
    position: "absolute",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    elevation: 5,
    marginLeft: 0,
    marginTop: 0,
  },
  roomText: {
    color: "white",
    fontSize: 7,
    fontWeight: "700",
  },
});
