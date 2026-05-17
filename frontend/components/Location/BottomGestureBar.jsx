import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ROOMS } from "../../utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ScrollView } from "react-native";
export default function BottomGestureBar({
  startRoom,
  endRoom,
  onClear,
  setStartRoom,
  setEndRoom,
}) {
  const [openStartDropdown, setOpenStartDropdown] = React.useState(false);
  const [openEndDropdown, setOpenEndDropdown] = React.useState(false);
  // Sheet ki maximum limits (Kitna upar ya neeche slide ho sakti hai)
  const SHEET_MAX_DRAG = 200; // Upar kitna jana chahiye
  const SHEET_MIN_DRAG = 350; // Niche default position

  const translateY = useSharedValue(SHEET_MIN_DRAG);
  const context = useSharedValue({ y: 0 });

  // Simple and Robust Pan Gesture
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      let nextY = event.translationY + context.value.y;
      // Sirf allowed range me drag hone dega
      translateY.value = Math.max(
        SHEET_MAX_DRAG,
        Math.min(nextY, SHEET_MIN_DRAG),
      );
    })
    .onEnd((event) => {
      // Swipe velocity ya distance ke mutabiq automatic snap karega
      if (event.velocityY < -500 || translateY.value < SHEET_MAX_DRAG / 2) {
        translateY.value = withSpring(SHEET_MAX_DRAG, { damping: 40 });
      } else {
        translateY.value = withSpring(SHEET_MIN_DRAG, { damping: 40 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const getRoomName = (id) => {
    if (!id) return "Not Selected";
    const room = ROOMS.find((r) => r.id === id);
    return room ? room.name : "Selected Point";
  };

  return (
  
      <Animated.View style={[styles.sheetContainer, animatedSheetStyle]}>
        {/* Upper Handle Drag Zone */}
        <GestureDetector gesture={gesture}>
        <View style={styles.gestureHandlerZone}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Navigation Details</Text>
        </View>
</GestureDetector>
        {/* Inner Content Area */}
        <View style={styles.contentContainer}>
          <View style={styles.routeInfoContainer}>
            {/* START POINT */}
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: "#635BFF" }]} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>START POINT</Text>

                <TouchableOpacity
                  style={styles.dropdownBox}
                  onPress={() => setOpenStartDropdown(!openStartDropdown)}
                >
                  <Text style={styles.valueText}>{getRoomName(startRoom)}</Text>
                  <Ionicons name="chevron-down" size={16} color="white" />
                </TouchableOpacity>

                {openStartDropdown && (
                  <ScrollView
                    style={styles.dropdown}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {ROOMS.map((room) => (
                      <TouchableOpacity
                        key={room.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setStartRoom(room.id);
                          setOpenStartDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{room.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>

            {/* LINE BETWEEN DOTS */}
            <View style={styles.verticalLine} />

            {/* END POINT */}
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: "#00F5D4" }]} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>DESTINATION</Text>

                <TouchableOpacity
                  style={styles.dropdownBox}
                  onPress={() => setOpenEndDropdown(!openEndDropdown)}
                >
                  <Text style={styles.valueText}>{getRoomName(endRoom)}</Text>
                  <Ionicons name="chevron-down" size={16} color="white" />
                </TouchableOpacity>

                {openEndDropdown && (
                  <ScrollView
                    style={styles.dropdown}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {ROOMS.map((room) => (
                      <TouchableOpacity
                        key={room.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setEndRoom(room.id);
                          setOpenEndDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{room.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          </View>

          {/* CLEAR BUTTON */}
          {(startRoom || endRoom) && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
              <Ionicons name="close-circle-outline" size={18} color="white" />
              <Text style={styles.clearBtnText}>Clear Route</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    bottom: 0, // Ab yeh hamesha physical bottom par fix rahegi
    left: 0,
    right: 0,
    backgroundColor: "#0F1424",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    zIndex: 99, // Map ke bilkul top par layer layer lane k liye
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 30, // Android shadow fix
    shadowColor: "#000",
    shadowOffset: { width: 0, y: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,

    // Default visible height jab sheet bottom par ho (Sirf handle aur title dikhane k liye)
    // Aur drag hone par baki hissa niche se niche nikalta dikhega
    paddingTop: 12,
    paddingBottom: 240, // Height ke hisab se padding expand ki takay space na tute
  },
  gestureHandlerZone: {
    paddingBottom: 5,
    width: "100%",
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginBottom: 10,
  },
  sheetTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 15,
    letterSpacing: 0.5,
    alignSelf: "flex-start",
  },
  contentContainer: {
    width: "100%",
  },
  routeInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.02)",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 16,
  },
  verticalLine: {
    width: 2,
    height: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 4,
    marginVertical: 4,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: "#6F768E",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 2,
  },
  valueText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#FF4A5A",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  clearBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 4,
  },

  dropdown: {
    marginTop: 8,
    backgroundColor: "#151A2E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    maxHeight: 150,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },

  dropdownText: {
    color: "white",
    fontSize: 13,
  },
});
